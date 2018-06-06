var BaseScene = require('BaseScene')

cc.Class({
    // 
    extends: BaseScene,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        // this.showBagView()
    },

    playGame: function () {
        cc.director.loadScene('GameMineScene');
    },

    showBagView: function () {
        cc.loader.loadRes("play/prefabs/view/BagView", function (err, prefab) {
            var node = cc.instantiate(prefab);
            var scene = cc.director.getScene()
            node.setPosition(1334/2, 750/2)
            scene.addChild(node)
        })
    },
    
    // called every frame
    update: function (dt) {

    },
});
