var game = new Phaser.Game(700, 500, Phaser.AUTO, 'game_div', false);
game.state.add('load', load_state);
game.state.add('menu', menu_state);
game.state.add('play', play_state);
game.state.add('end', end_state);

game.state.start('load');
