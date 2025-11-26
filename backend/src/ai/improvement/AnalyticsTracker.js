/**
 * Analytics Tracker
 * 
 * Tracks AI performance, user engagement, and system metrics
 * for continuous improvement.
 * 
 * @version 1.0
 */

const { createLogger } = require('../../utils/logger');
const logger = createLogger('ANALYTICS');

class AnalyticsTracker {
  constructor() {
    this.events = [];
    this.maxEvents = 10000; // Keep last 10k events
    
    this.metrics = {
      aiCalls: {
        total: 0,
        successful: 0,
        failed: 0,
        byReason: {},
        byPrompt: {}
      },
      userEngagement: {
        totalUsers: 0,
        activeUsers: 0,
        actions: {}
      },
      performance: {
        avgResponseTime: 0,
        responseTimesByPrompt: {}
      }
    };
  }

  /**
   * Track AI call
   */
  trackAICall(promptId, reason, context, success, responseTime, error = null) {
    const event = {
      type: 'ai_call',
      promptId,
      reason,
      success,
      responseTime,
      error: error?.message,
      userId: context.user?.user_id,
      timestamp: new Date().toISOString()
    };
    
    this.addEvent(event);
    
    // Update metrics
    this.metrics.aiCalls.total++;
    
    if (success) {
      this.metrics.aiCalls.successful++;
    } else {
      this.metrics.aiCalls.failed++;
    }
    
    // Track by reason
    if (!this.metrics.aiCalls.byReason[reason]) {
      this.metrics.aiCalls.byReason[reason] = { total: 0, successful: 0, failed: 0 };
    }
    this.metrics.aiCalls.byReason[reason].total++;
    if (success) {
      this.metrics.aiCalls.byReason[reason].successful++;
    } else {
      this.metrics.aiCalls.byReason[reason].failed++;
    }
    
    // Track by prompt
    if (!this.metrics.aiCalls.byPrompt[promptId]) {
      this.metrics.aiCalls.byPrompt[promptId] = { 
        total: 0, 
        successful: 0, 
        failed: 0,
        totalResponseTime: 0
      };
    }
    this.metrics.aiCalls.byPrompt[promptId].total++;
    if (success) {
      this.metrics.aiCalls.byPrompt[promptId].successful++;
      this.metrics.aiCalls.byPrompt[promptId].totalResponseTime += responseTime;
    } else {
      this.metrics.aiCalls.byPrompt[promptId].failed++;
    }
    
    logger.debug('AI call tracked', { promptId, reason, success, responseTime });
  }

  /**
   * Track user action
   */
  trackUserAction(userId, action, data = {}) {
    const event = {
      type: 'user_action',
      userId,
      action,
      data,
      timestamp: new Date().toISOString()
    };
    
    this.addEvent(event);
    
    // Update metrics
    if (!this.metrics.userEngagement.actions[action]) {
      this.metrics.userEngagement.actions[action] = 0;
    }
    this.metrics.userEngagement.actions[action]++;
    
    logger.debug('User action tracked', { userId, action });
  }

  /**
   * Track user engagement
   */
  trackEngagement(userId, eventType, metadata = {}) {
    const event = {
      type: 'engagement',
      userId,
      eventType,
      metadata,
      timestamp: new Date().toISOString()
    };
    
    this.addEvent(event);
  }

  /**
   * Add event to queue
   */
  addEvent(event) {
    this.events.push(event);
    
    // Trim if exceeds max
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
  }

  /**
   * Get metrics summary
   */
  getMetrics() {
    // Calculate average response time
    let totalResponseTime = 0;
    let totalSuccessful = 0;
    
    Object.values(this.metrics.aiCalls.byPrompt).forEach(stats => {
      totalResponseTime += stats.totalResponseTime;
      totalSuccessful += stats.successful;
    });
    
    this.metrics.performance.avgResponseTime = totalSuccessful > 0
      ? Math.round(totalResponseTime / totalSuccessful)
      : 0;
    
    // Calculate success rates
    const aiCallsSuccessRate = this.metrics.aiCalls.total > 0
      ? Math.round((this.metrics.aiCalls.successful / this.metrics.aiCalls.total) * 100)
      : 0;
    
    return {
      summary: {
        aiCalls: {
          total: this.metrics.aiCalls.total,
          successful: this.metrics.aiCalls.successful,
          failed: this.metrics.aiCalls.failed,
          successRate: `${aiCallsSuccessRate}%`
        },
        performance: {
          avgResponseTime: `${this.metrics.performance.avgResponseTime}ms`
        },
        userEngagement: {
          totalActions: Object.values(this.metrics.userEngagement.actions)
            .reduce((sum, count) => sum + count, 0),
          actionBreakdown: this.metrics.userEngagement.actions
        }
      },
      detailed: {
        byReason: this.metrics.aiCalls.byReason,
        byPrompt: this.calculatePromptMetrics()
      }
    };
  }

  /**
   * Calculate detailed prompt metrics
   */
  calculatePromptMetrics() {
    const promptMetrics = {};
    
    Object.entries(this.metrics.aiCalls.byPrompt).forEach(([promptId, stats]) => {
      const successRate = stats.total > 0
        ? Math.round((stats.successful / stats.total) * 100)
        : 0;
      
      const avgResponseTime = stats.successful > 0
        ? Math.round(stats.totalResponseTime / stats.successful)
        : 0;
      
      promptMetrics[promptId] = {
        calls: stats.total,
        successRate: `${successRate}%`,
        avgResponseTime: `${avgResponseTime}ms`
      };
    });
    
    return promptMetrics;
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit = 100, type = null) {
    let filtered = this.events;
    
    if (type) {
      filtered = filtered.filter(e => e.type === type);
    }
    
    return filtered.slice(-limit).reverse();
  }

  /**
   * Get events in time range
   */
  getEventsByTimeRange(startTime, endTime, type = null) {
    return this.events.filter(e => {
      const eventTime = new Date(e.timestamp);
      const inRange = eventTime >= startTime && eventTime <= endTime;
      const matchesType = !type || e.type === type;
      return inRange && matchesType;
    });
  }

  /**
   * Clear old events
   */
  clearOldEvents(olderThan = 24 * 60 * 60 * 1000) { // Default 24 hours
    const cutoff = Date.now() - olderThan;
    const before = this.events.length;
    
    this.events = this.events.filter(e => {
      return new Date(e.timestamp).getTime() > cutoff;
    });
    
    const removed = before - this.events.length;
    if (removed > 0) {
      logger.info(`Cleared ${removed} old events`);
    }
  }

  /**
   * Reset metrics
   */
  reset() {
    this.events = [];
    this.metrics = {
      aiCalls: {
        total: 0,
        successful: 0,
        failed: 0,
        byReason: {},
        byPrompt: {}
      },
      userEngagement: {
        totalUsers: 0,
        activeUsers: 0,
        actions: {}
      },
      performance: {
        avgResponseTime: 0,
        responseTimesByPrompt: {}
      }
    };
    logger.info('Analytics metrics reset');
  }

  /**
   * Export data for analysis
   */
  exportData() {
    return {
      events: this.events,
      metrics: this.metrics,
      exportedAt: new Date().toISOString()
    };
  }
}

// Singleton instance
let analyticsInstance = null;

function getAnalyticsTracker() {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsTracker();
  }
  return analyticsInstance;
}

module.exports = { AnalyticsTracker, getAnalyticsTracker };

