cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {

    },

    playGame: function () {
        cc.director.loadScene('GameMineScene');
    },
    
    // called every frame
    update: function (dt) {

    },
});
