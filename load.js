var load_state = {
    preload: function() {
	game.stage.setBackgroundColor(0x000000);

	text = this.game.add.text(250, 250, "loading..", {
	    font: '30px Arial',
	    fill: '#FFFFFF'
	});

	this.game.load.image('scene', 'assets/big_loading.png');
	this.game.load.image('loading', 'assets/full_loading.png');
	this.game.load.image('flag', 'assets/flag.png');
	this.game.load.spritesheet('character', 'assets/character.png');

	this.game.load.spritesheet('legs', 'assets/legs/legs.png', 10, 4, 12);

	this.game.load.spritesheet('torso', 'assets/torso/torso.png', 16, 6, 4);

	this.game.load.image('headIdle', 'assets/head/idle.png');


	this.game.load.image('top_stalactite', 'assets/top_stalactite.png');
	this.game.load.image('bot_stalactite', 'assets/bot_stalactite.png');
	this.game.load.image('background', 'assets/background.png');

	game.load.spritesheet('mummy', 'assets/mummy.png', 37, 45, 18);
	//this.game.load.spritesheet('jump_button', 'assets/jump_button.png', 500, 250);
	//this.game.load.spritesheet('crouch_button', 'assets/crouch_button.png', 500, 250);
	//this.game.load.spritesheet('run_button', 'assets/run_button.png', 500, 500);

	this.game.load.tilemap('level1', 'level/1.json', null, Phaser.Tilemap.TILED_JSON);

	this.game.load.image('map_tiles', 'assets/tilemap.png');

    },

    create: function() {
	game.state.start('play');
    },
};
