var play_state = {
	preload: function() {
		game.stage.setBackgroundColor(0x7EC0EE);
	},

	create: function() {
		this.wallGroup = this.game.add.group();
		this.game.physics.startSystem(Phaser.Physics.ARCADE)
		this.game.physics.arcade.gravity.y = 200;
		this.game.stage.smoothed = false;
		this.velocity = 0;
		this.running = false
		this.attacking = false;


		//add character sprite and animations
		this.character = this.game.add.sprite(0, 0, 'legs');
		this.character.scale = {x:5,y:5};

		this.character.anchor = {x:.5, y : .5};


		this.torso = this.game.add.sprite(0, -5, 'torso');
		this.torso.anchor = {x:.5, y : .5};

		this.head = this.game.add.sprite(.5, -9, 'headIdle');
		this.head.anchor = {x:.5, y : .5};

		this.character.addChild(this.torso);
		this.torso.addChild(this.head);

		 //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
   		//this.mummy.animations.add('walk');

    	//this.mummy.animations.play('walk', 20, true);


   		this.character.animations.add('walk',[0,1,2,3]);
   		this.character.animations.add('stop',[4,5,6,7]);
   		this.character.animations.add('jumpUp',[8]);
   		this.character.animations.add('jumpForward',[9]);

   		this.torso.animations.add('walk',[0,1,2,3]);
   		this.character.animations.add('idle', [0]);
   		this.torso.animations.add('idle', [0]);
   		this.torso.animations.add('jump',[3]);
   		this.torso.animations.add('punch',[4,5,6,7,7,6,5,4]);
		

		this.character.smoothed = false;
		this.torso.smoothed = false;
		this.head.smoothed = false;

		//this.characterGroup.add(this.character);
				 //this.PIXI.BaseTexture.SCALE_MODE.NEAREST;

		/*
		this.character.animations.add('walk', [0, 1, 2, 3, 4], 15, true);
		this.character.animations.add('crouch', [5, 6, 7, 8, 9], 30, false);
		*/
		
		this.load_level(1);

		this.left = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.right = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.down = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.up = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.attack = this.game.input.keyboard.addKey(Phaser.Keyboard.E);

		this.attack.onDown.add(function() {
			this.attacking = true;
		}, this);

		this.right.onDown.add(function() {
			this.velocity = 1;
			this.character.scale = {x:5,y:5};
			this.running = true;
		}, this);
		this.left.onDown.add(function() {
			this.velocity = -1;
			this.character.scale = {x:-5,y:5};
			this.running = true;
		}, this);
		this.down.onDown.add(function() {
			this.crouch=true;
		}, this);
		this.up.onDown.add(function() {
			this.jump=true;
		}, this);



		this.right.onUp.add(function() {
			this.running=false;
		}, this);
		this.left.onUp.add(function() {
			this.running=false;
		}, this);
		this.up.onUp.add(function() {this.jump=false;}, this);

		this.torso.body.enable = false;
		this.head.body.enable = false;

		this.character.body.setSize(10, 20, 0, -40)
	},

	update: function() { 
		this.game.physics.arcade.collide(this.character, this.layer);
		if(this.punching && this.punching.isFinished){
			this.attacking = false;
			this.punching = null;
		}
		/*
		this.game.physics.arcade.overlap(this.character, this.flag, 
			function () {
				this.load_level(this.level + 1);
			}, null, this);
		*/



		if(this.velocity <= .1 && this.velocity >= -.1){
			this.velocity = 0;
		}

		if (this.jump && this.character.body.onFloor()) {
			this.character.body.velocity.y = -600;
			//console.log("pokemon");
		}

		this.character.body.velocity.x = this.velocity * 150;



		if(this.running){

    		this.character.animations.play('walk', 8, true);
	    	this.torso.animations.play('walk', 8, true);
			
		}
		else if(this.velocity > 0 || this.velocity<0){
			this.velocity *= .9;
    		this.character.animations.play('stop', 8, false);

    			this.torso.animations.play('idle', 8, true);
		}
		else if(this.character.body.onFloor()){
			this.character.animations.play('idle', 8, false);
	    	if(this.attacking || (this.punching && !this.punching.isFinished)){
	    		this.punching = this.torso.animations.play('punch', 16, false);
			}
			else{
				this.torso.animations.play('idle', 8, false);
			}
		}
		if (!this.character.body.onFloor()) {
			if(this.running){
				this.character.animations.play('jumpForward', 8, false);
			}
			else{
				this.character.animations.play('jumpUp', 8, false);
			}
			this.torso.animations.play('jump', 8, false);
		}
/*
	if (this.run) {
		//this.character.animations.play('walk');

		if (this.character.body.onFloor() && this.character.body.velocity.x > 300)
			this.character.body.velocity.x -= 2;
		else if (this.character.body.onFloor())
			this.character.body.velocity.x = 300;
		else if (this.character.body.velocity.x < 450)
			this.character.body.velocity.x += 5;
	} else if (this.character.body.onFloor()) {
		this.character.body.velocity.x *= 0.9;
	}
*/


	if (this.character.body.x < 0 || this.character.body.x >= this.game.world.width - 50 || 
		this.character.body.y < 0 || this.character.body.y >= this.game.world.height - 50) {
		this.die();
}

	// this.jump = false;
	// this.crouch = false;
	// this.run = false;
		//this.torso.position = {x: this.character.position.x, y: this.character.position.y - 30};
		//this.head.position = {x: this.character.position.x, y: this.character.position.y - 90};


},

load_level: function(level) {
	if (this.layer) this.layer.destroy();


/*
	if (level == 1)
		text = "RIGHT to run";
	else if (level == 2)
		text = "UP to jump";
	else if (level == 3)
		text = "DOWN to crouch";
	if (1 <= level && level <= 3) {
		this.infos = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 
			text, {
				font: '60px Arial',
				fill: '#87E8D1',
				align: 'center',
			});
		this.infos.anchor.setTo(0.5, 0.5);
	}
	*/

	this.map = this.game.add.tilemap('house');
	this.map.addTilesetImage('tilesetBig', 'tilesetBig');
	//this.world.scale = {x:2, y: 2};
	//this.map.setCollisionBetween(1,30);	
	
	this.layer2 = this.map.createLayer('walls',1024,1024,this.wallGroup);	
	this.layer3 = this.map.createLayer('subDecals',1024,1024,this.wallGroup);	
	this.layer3 = this.map.createLayer('decals',1024,1024,this.wallGroup);	
	this.layer = this.map.createLayer('layer',1024,1024,this.wallGroup);	

	this.layer.resizeWorld();
	this.map.setCollisionBetween(0, 30, true, "layer", true );

	//this.layer2 = this.map.createLayer('walls');	
	//this.layer3 = this.map.createLayer('decals');	
	
	/*
	this.top_stalactites = this.game.add.group();
	this.top_stalactites.enableBody = true;
	this.top_stalactites.physicsBodyType = Phaser.Physics.ARCADE;
	this.bot_stalactites = this.game.add.group();
	this.bot_stalactites.enableBody = true;
	this.bot_stalactites.physicsBodyType = Phaser.Physics.ARCADE;

	this.map.createFromObjects('stalactites', 9, 'top_stalactite', 0, true, false, this.top_stalactites);
	this.map.createFromObjects('stalactites', 10, 'bot_stalactite', 0, true, false, this.bot_stalactites);
	this.top_stalactites.forEach(function(s) {
		s.body.allowGravity = false;
		s.body.immovable = true;
	}, this);
	this.bot_stalactites.forEach(function(s) {
		s.body.allowGravity = false;
		s.body.immovable = true;
	}, this);
	

	this.flag = this.game.add.group();
	this.flag.enableBody = true;
	this.flag.physicsBodyType = Phaser.Physics.ARCADE;
	this.map.createFromObjects('flag', 4, 'flag', 0, true, false, this.flag);
	this.flag.forEach(function(f) {
		f.body.allowGravity = false;
		f.body.immovable = true;
	}, this);
*/

	this.game.physics.enable([this.character, this.layer]);

	this.character.body.velocity.x = 0;
	this.character.body.velocity.y = 0;
	this.character.position.setTo(450, 500);
	this.character.body.gravity.y = 500;

	this.game.camera.follow(this.character);
	//this.game.camera.setBoundsToWorld();
	//this.game.camera.focusOnXY(this.character.position.x,this.character.position.x));

	this.level = level;
},

die : function() {
	/*
	this.character.anchor.setTo(0.5, 0.5);
	var t = this.game.add.tween(this.character).to({angle:360}, 300).start();
	this.character.body.gravity.y = 0;
	this.character.body.velocity.x = 0;
	this.character.body.velocity.y = 0;
	t.onComplete.add(function() {
		this.load_level(this.level);
	}, this);
*/
},
};
