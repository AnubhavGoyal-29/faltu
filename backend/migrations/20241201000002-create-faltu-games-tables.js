'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Daily Bakchodi Challenge
    await queryInterface.createTable('BakchodiChallenges', {
      challenge_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' }
      },
      challenge_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      submission: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      ai_score: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      ai_review: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Random Arguments
    await queryInterface.createTable('Debates', {
      debate_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' }
      },
      topic: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      user_argument: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      ai_counter_argument: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      winner: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      ai_explanation: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Meme Battles
    await queryInterface.createTable('MemeBattles', {
      battle_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' }
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      caption: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      humor_score: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      creativity_score: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      nonsense_score: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      total_score: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Nonsense Wheel Results
    await queryInterface.createTable('WheelSpins', {
      spin_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' }
      },
      result_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      result_content: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // AI Future Predictions
    await queryInterface.createTable('FuturePredictions', {
      prediction_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' }
      },
      user_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      mood: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      fav_snack: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      prediction: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Tap Game Scores
    await queryInterface.createTable('TapGameScores', {
      score_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' }
      },
      taps: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Runaway Button Wins
    await queryInterface.createTable('RunawayButtonWins', {
      win_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' }
      },
      attempts: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      points_earned: {
        type: Sequelize.INTEGER,
        defaultValue: 50
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Dares
    await queryInterface.createTable('Dares', {
      dare_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' }
      },
      dare_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Roasts
    await queryInterface.createTable('Roasts', {
      roast_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' }
      },
      roast_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Game Rooms (for Room Chaos Mode)
    await queryInterface.createTable('GameRooms', {
      game_room_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      room_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'completed'),
        defaultValue: 'active'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Users in Game Rooms
    await queryInterface.createTable('GameRoomUsers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      game_room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'GameRooms', key: 'game_room_id' }
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' }
      },
      joined_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('GameRoomUsers');
    await queryInterface.dropTable('GameRooms');
    await queryInterface.dropTable('Roasts');
    await queryInterface.dropTable('Dares');
    await queryInterface.dropTable('RunawayButtonWins');
    await queryInterface.dropTable('TapGameScores');
    await queryInterface.dropTable('FuturePredictions');
    await queryInterface.dropTable('WheelSpins');
    await queryInterface.dropTable('MemeBattles');
    await queryInterface.dropTable('Debates');
    await queryInterface.dropTable('BakchodiChallenges');
  }
};

