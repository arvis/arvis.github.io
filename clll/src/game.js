var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

//FIXME: move to better location
var sword;
var giggle;
var coin1;
var coin3;
var clickme;
var monsterTween;

game.state.add('play', {
    preload: function() {

        var back_beach='assets/beach-background.jpeg';
        var back_football='assets/opponents/field.jpg';
        var background='assets/beach-background.jpeg';

        var images_beach=[
            'assets/opponents/girls_1.png',
            'assets/opponents/girls_2.png',
            'assets/opponents/girls_3.png',
            'assets/opponents/girls_4.png',
            'assets/opponents/men_1.png',
            'assets/opponents/men_2.png',
            'assets/opponents/men_3.png',
        ];

        var images_football=[
            'assets/opponents/football1.png',
            'assets/opponents/football2.png',
            'assets/opponents/football3.png',
            'assets/opponents/football4.png',
            'assets/opponents/football5.png',
            'assets/opponents/football6.png',
            'assets/opponents/football6.png',
        ];
        
        var images= [
            'assets/opponents/football1.png',
            'assets/opponents/football2.png',
            'assets/opponents/football3.png',
            'assets/opponents/football4.png',
            'assets/opponents/football5.png',
            'assets/opponents/football6.png',
            'assets/opponents/football6.png',
        ];

        var urlParams = new URLSearchParams(window.location.search);
        var game_type=urlParams.get('type');
        console.log(game_type);

        if (game_type=="beach"){
            images= images_beach;
            background=back_beach;
            console.log("this is beach");

        } else {
            images= images_football;
            background= back_football;
        }


        // this.game.load.image('forest-front', 'assets/beach-background.jpeg');
        this.game.load.image('forest-front', background);


        this.game.load.image('girl_1', images[0]);
        this.game.load.image('girl_2', images[1]);
        this.game.load.image('girl_3', images[2]);
        this.game.load.image('girl_4', images[3]);
        this.game.load.image('men_1', images[4]);
        this.game.load.image('men_2', images[5]);
        this.game.load.image('men_3', images[6]);

        this.game.load.image('gold_coin', 'assets/496_RPG_icons/I_GoldCoin.png');
        this.game.load.image('dagger', 'assets/496_RPG_icons/W_Dagger002.png');
        this.game.load.image('swordIcon1', 'assets/496_RPG_icons/S_Sword15.png');

        this.game.load.image('clickme', 'assets/clickme.png');


        // game.load.audio('sword', 'assets/sounds/sword.mp3');
        // game.load.audio('sword', 'assets/sounds/wine_short.wav');
        game.load.audio('sword', 'assets/sounds/ball.wav');
        
        // game.load.audio('giggle', 'assets/sounds/giggle_short.wav');
        game.load.audio('giggle', 'assets/sounds/goal.wav');
        game.load.audio('coin1', 'assets/sounds/coin1.wav');
        game.load.audio('coin3', 'assets/sounds/coin3.wav');

        // build panel for upgrades
        var bmd = this.game.add.bitmapData(250, 500);
        bmd.ctx.fillStyle = '#9a783d';
        bmd.ctx.strokeStyle = '#35371c';
        bmd.ctx.lineWidth = 12;
        bmd.ctx.fillRect(0, 0, 250, 500);
        bmd.ctx.strokeRect(0, 0, 250, 500);
        this.game.cache.addBitmapData('upgradePanel', bmd);

        var buttonImage = this.game.add.bitmapData(476, 48);
        buttonImage.ctx.fillStyle = '#e6dec7';
        buttonImage.ctx.strokeStyle = '#35371c';
        buttonImage.ctx.lineWidth = 4;
        buttonImage.ctx.fillRect(0, 0, 225, 48);
        buttonImage.ctx.strokeRect(0, 0, 225, 48);
        this.game.cache.addBitmapData('button', buttonImage);

        // the main player
        this.player = {
            clickDmg: 1,
            gold: 50,
            dps: 0
        };

        // world progression
        this.level = 1;
        // how many monsters have we killed during this level
        this.levelKills = 0;
        // how many monsters are required to advance a level
        this.levelKillsRequired = 10;
    },
    create: function() {
        var state = this;

        this.background = this.game.add.group();
        // setup each of our background layers to take the full screen
        ['forest-front']
            .forEach(function(image) {
                var bg = state.game.add.tileSprite(0, 0, state.game.world.width,
                    state.game.world.height, image, '', state.background);
                // bg.tileScale.setTo(4,4);
            });

        this.upgradePanel = this.game.add.image(10, 70, this.game.cache.getBitmapData('upgradePanel'));
        var upgradeButtons = this.upgradePanel.addChild(this.game.add.group());
        upgradeButtons.position.setTo(8, 8);

        var upgradeButtonsData = [
            {icon: 'dagger', name: 'Attack', level: 0, cost: 5, purchaseHandler: function(button, player) {
                player.clickDmg += 1;
            }},
            {icon: 'swordIcon1', name: 'Auto-Attack', level: 0, cost: 25, purchaseHandler: function(button, player) {
                player.dps += 5;
            }}
        ];

        var button;
        upgradeButtonsData.forEach(function(buttonData, index) {
            button = state.game.add.button(0, (50 * index), state.game.cache.getBitmapData('button'));
            button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
            button.text = button.addChild(state.game.add.text(42, 6, buttonData.name + ': ' + buttonData.level, {font: '16px Arial Black'}));
            button.details = buttonData;
            button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + buttonData.cost, {font: '16px Arial Black'}));
            button.events.onInputDown.add(state.onUpgradeButtonClick, state);

            upgradeButtons.addChild(button);
        });

        var monsterData = [
            { name: 'Ronaldu', image: 'girl_1', maxHealth: 10 },
            { name: 'John', image: 'girl_2', maxHealth: 20 },
            { name: 'Juhan', image: 'girl_3', maxHealth: 30 },
            { name: 'Mesi', image: 'girl_4', maxHealth: 5 },
            { name: 'Oleg', image: 'men_1', maxHealth: 10 },
            { name: 'Yurii', image: 'men_2', maxHealth: 10 },
            { name: 'Igor', image: 'men_3', maxHealth: 15 }
        ];
        this.monsters = this.game.add.group();
        sword = game.add.audio('sword');
        giggle = game.add.audio('giggle');
        coin1 = game.add.audio('coin1');
        coin3 = game.add.audio('coin3');

        // clickme = game.add.sprite(this.game.world.centerX+30,this.game.world.centerY-120,'clickme');
        // game.sound.setDecodedCallback([sword], this.start, this);

        var monster;
        monsterData.forEach(function(data) {
            // create a sprite for them off screen
            monster = state.monsters.create(1000, state.game.world.centerY, data.image);
            // use the built in health component
            monster.health = monster.maxHealth = data.maxHealth;
            // center anchor
            monster.anchor.setTo(0.5, 1);
            // reference to the database
            monster.details = data;

            //enable input so we can click it!
            monster.inputEnabled = true;
            monster.events.onInputDown.add(state.onClickMonster, state);
            monster.events.onInputUp.add(state.onInputUp, state);

            // hook into health and lifecycle events
            monster.events.onKilled.add(state.onKilledMonster, state);
            monster.events.onRevived.add(state.onRevivedMonster, state);
        });

        // display the monster front and center
        this.currentMonster = this.monsters.getRandom();
        //FIXME: refactor to create less cluttered code
        // this.currentMonster.position.set(this.game.world.centerX + 100, this.game.world.centerY + 50);
        this.currentMonster.position.set(this.game.world.centerX + 100, this.game.world.centerY +200);

        // add click me sign
/*        
        monsterTween = game.add.tween(clickme).to({ alpha: 0 }, 1000, 
            Phaser.Easing.Linear.Out, true, 0);
        monsterTween.repeat(Infinity);
        monsterTween.start();
*/
        this.monsterInfoUI = this.game.add.group();
        this.monsterInfoUI.position.setTo(this.currentMonster.x - 220, this.currentMonster.y + 0);
        this.monsterNameText = this.monsterInfoUI.addChild(this.game.add.text(0, 0, this.currentMonster.details.name, {
            font: '48px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        }));
        this.monsterHealthText = this.monsterInfoUI.addChild(this.game.add.text(this.game.world.centerX, 10,
            this.currentMonster.health + ' HP', {
            font: '32px Arial Black',
            fill: '#ff0000',
            strokeThickness: 4
        }));

        this.dmgTextPool = this.add.group();
        var dmgText;
        for (var d=0; d<50; d++) {
            dmgText = this.add.text(0, 0, '1', {
                font: '64px Arial Black',
                fill: '#fff',
                strokeThickness: 4
            });
            // start out not existing, so we don't draw it yet
            dmgText.exists = false;
            dmgText.tween = game.add.tween(dmgText)
                .to({
                    alpha: 0,
                    y: 100,
                    x: this.game.rnd.integerInRange(100, 700)
                }, 1000, Phaser.Easing.Cubic.Out);

            dmgText.tween.onComplete.add(function(text, tween) {
                text.kill();
            });
            this.dmgTextPool.add(dmgText);
        }

        // create a pool of gold coins
        this.coins = this.add.group();
        this.coins.createMultiple(50, 'gold_coin', '', false);
        this.coins.setAll('inputEnabled', true);
        this.coins.setAll('goldValue', 1);
        this.coins.callAll('events.onInputDown.add', 'events.onInputDown', this.onClickCoin, this);

        this.playerGoldText = this.add.text(30, 30, 'Gold: ' + this.player.gold, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });

        // 100ms 10x a second
        this.dpsTimer = this.game.time.events.loop(100, this.onDPS, this);

        // setup the world progression display
        this.levelUI = this.game.add.group();
        this.levelUI.position.setTo(this.game.world.centerX, 30);
        this.levelText = this.levelUI.addChild(this.game.add.text(0, 0, 'Level: ' + this.level, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        }));
        this.levelKillsText = this.levelUI.addChild(this.game.add.text(0, 30, 'Kills: ' + this.levelKills + '/' + this.levelKillsRequired, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        }));
    },
    onDPS: function() {
        if (this.player.dps > 0) {
            if (this.currentMonster && this.currentMonster.alive) {
                var dmg = this.player.dps / 10;
                this.currentMonster.damage(dmg);
                // update the health text
                this.monsterHealthText.text = this.currentMonster.alive ? Math.round(this.currentMonster.health) + ' HP' : 'DEAD';
            }
        }
    },
    onUpgradeButtonClick: function(button, pointer) {
        // make this a function so that it updates after we buy
        function getAdjustedCost() {
            return Math.ceil(button.details.cost + (button.details.level * 1.46));
        }

        if (this.player.gold - getAdjustedCost() >= 0) {
            this.player.gold -= getAdjustedCost();
            this.playerGoldText.text = 'Gold: ' + this.player.gold;
            button.details.level++;
            button.text.text = button.details.name + ': ' + button.details.level;
            button.costText.text = 'Cost: ' + getAdjustedCost();
            button.details.purchaseHandler.call(this, button, this.player);
            coin1.play();
        }
    },
    onClickCoin: function(coin) {
        if (!coin.alive) {
            return;
        }
        // give the player gold
        this.player.gold += coin.goldValue;
        // update UI
        this.playerGoldText.text = 'Gold: ' + this.player.gold;

        //play a sound
        coin1.play();

        // remove the coin
        coin.kill();
    },
    onKilledMonster: function(monster) {
        // move the monster off screen again
        monster.position.set(1000, this.game.world.centerY);

        var coin;
        // spawn a coin on the ground
        coin = this.coins.getFirstExists(false);
        coin.reset(this.game.world.centerX + this.game.rnd.integerInRange(-100, 100), this.game.world.centerY);
        //fast tween to the ground
        // tween = game.add.tween(sprite).to( { y: 500 }, 2000, Phaser.Easing.Bounce.Out, true);
        var tween = game.add.tween(coin).to({ y: this.game.world.centerY+180 }, 500, Phaser.Easing.Linear.None, true);
        tween.onComplete.removeAll();



        coin.goldValue = Math.round(this.level * 1.33);
        this.game.time.events.add(Phaser.Timer.SECOND * 3, this.onClickCoin, this, coin);

        this.levelKills++;

        // play a sound
        giggle.play();

        // gained new level
        if (this.levelKills >= this.levelKillsRequired) {
            this.level++;
            this.levelKills = 0;
            coin1.play();
        }

        this.levelText.text = 'Level: ' + this.level;
        this.levelKillsText.text = 'Kills: ' + this.levelKills + '/' + this.levelKillsRequired;

        // pick a new monster
        this.currentMonster = this.monsters.getRandom();
        // upgrade the monster based on level
        this.currentMonster.maxHealth = Math.ceil(this.currentMonster.details.maxHealth + ((this.level - 1) * 10.6));
        // make sure they are fully healed
        this.currentMonster.revive(this.currentMonster.maxHealth);
    },
    onRevivedMonster: function(monster) {
        // monster.position.set(this.game.world.centerX + 100, this.game.world.centerY + 50);
        monster.position.set(this.game.world.centerX + 100, this.game.world.centerY + 200);
        // update the text display
        this.monsterNameText.text = monster.details.name;
        this.monsterHealthText.text = monster.health + 'HP';
    },
    onInputUp:function(monster,pointer){
       this.currentMonster.rotation = 0; 
       this.currentMonster.scale.setTo(1,1);
       //monsterTween.resume();

    },
    onClickMonster: function(monster, pointer) {
        // apply click damage to monster
        this.currentMonster.damage(this.player.clickDmg);
//       monsterTween.pause();

        // fake animation
        this.currentMonster.rotation = -.10; // or .angle = 45;
        this.currentMonster.scale.setTo(1.1,1.1);

        // show slash icon

        // grab a damage text from the pool to display what happened
        var dmgText = this.dmgTextPool.getFirstExists(false);
        if (dmgText) {
            dmgText.text = this.player.clickDmg;
            dmgText.reset(pointer.positionDown.x, pointer.positionDown.y);
            dmgText.alpha = 1;
            dmgText.tween.start();
        }

        // update the health text
        this.monsterHealthText.text = this.currentMonster.alive ? this.currentMonster.health + ' HP' : 'DEAD';

        // play a sound
        sword.play();
    }
});

game.state.start('play');
