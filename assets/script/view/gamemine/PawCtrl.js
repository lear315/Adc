var BaseCtrl = require('BaseCtrl')
var D = require('DebugFunc')

cc.Class({
    extends: BaseCtrl,

    properties: {
        rotateSpeed: 10,
        rotateMax: 70,
        dropSpeed: 100,
        raiseSpeed: 100,
        paw: cc.SpriteFrame,
        pawLeft: cc.SpriteFrame,
        pawRight: cc.SpriteFrame,
    },

    // use this for initialization
    onLoad: function () {
        
        this.init();
    },

    // called every frame
    update: function (dt) {

    },

    //动画更新后执行
    lateUpdate: function (dt) {
        var curPawPos = this.node.getPosition();
        var length = curPawPos.sub(this.orginPos).mag();
        this.setLineLength(length);
    },

    setMiner (miner) {
        this.miner = miner;
    },

    init () {
        this.state = {
            AWAIT : 1, //等待状态
            DROP : 2, //放下爪子状态
            RAISE : 3, //提起爪子
        };
        this.curState = this.state.AWAIT; //当前爪子状态
        this.orginPos = this.node.getPosition();

        this.speedFix = 100; //速度修正系数
        //this.dropSpeed = 100; //爪子下抓的速度
        //this.raiseSpeed = 100; //爪子提起的速度
        this.line =  this.node.getChildByName("Line");
        this.gain =  this.node.getChildByName("Gain")

        this.node.getComponent('cc.PolygonCollider').enabled = true;
    },

    changeState (state) {
        if (state != this.curState) {
            this.curState = state
        }
    },

    await () {
        //待机旋转  
        if (this.actionRaise) {
            this.node.stopAction(this.actionRaise);
            this.actionRaise = null;
        }
        this.changeState(this.state.AWAIT);
        this.actionAwait = cc.repeatForever(
            cc.sequence(
                cc.rotateTo(this.speedFix/this.rotateSpeed, -1*this.rotateMax), 
                cc.rotateTo(this.speedFix/this.rotateSpeed, this.rotateMax)
            ));
        this.node.runAction(this.actionAwait);

        this.miner.stopAnim()
    },

    drop () {
        //放下爪子
        if (this.actionAwait) {
            this.node.stopAction(this.actionAwait);
            this.actionAwait = null;
        }
        this.changeState(this.state.DROP);
        var ratete = this.node.getRotation();
        var length = this.getLength(ratete);
        var aimPos = this.getAimPoint(ratete);

        this.actionDrop = cc.sequence(
            cc.moveTo(this.speedFix/this.dropSpeed, aimPos), 
            cc.callFunc(() => {
                this.raise();
            }, this)
        )
        this.node.runAction(this.actionDrop);
        
        this.miner.ahold()
    },

    raise () {
        //提起爪子
        if (this.actionDrop) {
            this.node.stopAction(this.actionDrop);
            this.actionDrop = null;
        }
        this.changeState(this.state.RAISE);
        this.actionRaise = cc.sequence(
            cc.moveTo(this.speedFix/this.raiseSpeed, this.orginPos),
            cc.callFunc(() => {
                this.await();
            }, this)
        )
        this.node.runAction(this.actionRaise);
    },

    raiseByGold () {
        //抓住金子,提起爪子
        if (this.actionDrop) {
            this.node.stopAction(this.actionDrop);
            this.actionDrop = null;
        }
        this.changeState(this.state.RAISE);
        this.actionRaise = cc.sequence(
            cc.moveTo(this.speedFix/this.raiseSpeed, this.orginPos),
            cc.delayTime(0.5),
            cc.callFunc(() => {
                this.getComponent(cc.Sprite).spriteFrame = this.paw;  
                this.gain.active = false

                this.await();
            }, this)
        )
        this.node.runAction(this.actionRaise);
    },

    //获取爪子放下的距离
    getLength (ratete) {
        var height = 568; //高
        var weight = 1134/2; //宽
        var absRatete = Math.abs(ratete);
        var length = 0;
        if (absRatete < 45) {
            length = height/Math.cos(Math.abs(ratete * Math.PI / 180));
        }else{
            length = weight/Math.sin(Math.abs(ratete * Math.PI / 180));
        }
        return length
    },

    //获取爪子预计到达的目标点
    getAimPoint (ratete) {
        var nodePos = this.node.getPosition();
        var x = nodePos.x;
        var y = nodePos.y;
        var dir = ratete/Math.abs(ratete);

        var height = 550; //高
        var weight = 1334/2; //宽
        var absRatete = Math.abs(ratete);
        var length = 0;
        if (absRatete < 45) {
            length = height * Math.tan(Math.abs(ratete * Math.PI / 180));
            x = x - dir*length;
            y = y - height;
        }else{
            length = weight/Math.tan(Math.abs(ratete * Math.PI / 180));
            x = x - dir*weight;
            y = y - length;
        }
        var pos = cc.v2(x, y);
        return pos
    },

    //改变爪子贴图
    changePawHold (other) {
        this.getComponent(cc.Sprite).spriteFrame = null;  
        this.gain.active = true
        var size = other.node.getComponent("GoldCtrl").size
        this.gain.getChildByName('PGold').setScale(size/10)
        other.node.removeFromParent();
    },

    //碰撞产生的时候调用
    onCollisionEnter: function (other, self) {
        console.log('on collision enter');
        this.changePawHold(other);
        //拉回钩子
        this.raiseByGold();
    
    },


 //-----------------------------------Line---------------------------------

    //设置绳子长度
    setLineLength (length) {
        this.line.height = length + 22;
    }
 
});
