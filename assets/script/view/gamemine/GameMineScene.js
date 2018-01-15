var BaseScene = require('BaseScene')

cc.Class({
    extends: BaseScene,

    properties: {
        canvas: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;

        this.init();
    },

    init () {
        this.isDropPawing = false //抓取的状态
        this.paw = this.canvas.getChildByName("Paw").getComponent("PawCtrl");
        this.miner = this.canvas.getChildByName("Miner").getComponent("MinerCtrl");
        this.paw.setMiner(this.miner);
        this.paw.await();
        
        this.canvas.on(cc.Node.EventType.TOUCH_START, event => {
            var touches = event.getTouches();
            var touchLoc = touches[0].getLocation();
            //console.log("--------------touch start-----------------")
            this.dropPaw();

        }, this.node);
        
        this.canvas.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var touches = event.getTouches();
            var touchLoc = touches[0].getLocation();
            console.log("--------------touch move-----------------")

        }, this.node);

        this.canvas.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log("--------------touch end-----------------")

        }, this.node);
    },

    // called every frame
    update: function (dt) {
        
    },

    // 放下爪子
    dropPaw: function () {
        if (this.paw.curState == this.paw.state.AWAIT) {
            this.paw.drop();
        }
    },

    // 退出游戏
    exitGame: function () {
        cc.game.end()
    },

});
