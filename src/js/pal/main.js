import utils from './utils';
import ajax from './ajax';
import input from './input';
import Surface from './surface';
import Palette from './palette';
import welcome from './welcome';
import ui from './ui';
import scene from './scene';
import game from './game';
import rng from './rng';

log.trace('main module load');

var main = {};

main.initGlobals = function*() {
  utils.extend(Global, {
    /*
    currentSaveSlot: 0,    // current save slot (1-5)
    curMainMenuItem: 0,    // current main menu item number
    curSystemMenuItem: 0,  // current system menu item number
    curInvMenuItem: 0,     // current inventory menu item number
    curPlayingRNG: 0,      // current playing RNG animation
    gameStart: false,      // TRUE if the has just started
    enteringScene: false,  // TRUE if entering a new scene
    needToFadeIn: false,   // TRUE if need to fade in when drawing scene
    inBattle: false,       // TRUE if in battle
    autoBattle: false,     // TRUE if auto-battle
    lastUnequippedItem: 0, // last unequipped item

    PLAYERROLES      rgEquipmentEffect[MAX_PLAYER_EQUIPMENTS + 1]; // equipment effects
    WORD             rgPlayerStatus[MAX_PLAYER_ROLES][kStatusAll]; // player status
    equipmentEffect: [],   // equipment effects
    playerStatus: [],      // player status
    viewport: 0,           // viewport coordination
    partyOffset: 0,
    layer: 0,
    maxPartyMemberIndex: 0,// max index of members in party (0 to MAX_PLAYERS_IN_PARTY - 1)
    party: [],             // player party
    trail: [],             // player trail
    */
    partyDirection: 4,     // direction of the party
    /*
    numScene: 0,           // current scene number
    numPalette: 0,         // current palette number
    nightPalette: false,   // TRUE if use the darker night palette
    numMusic: 0,           // current music number
    numBattleMusic: 0,     // current music number in battle
    numBattleField: 0,     // current battle field number
    collectValue: 0,       // value of "collected" items
    screenWave: 0,         // level of screen waving
    waveProgression: 0,
    chaseRange: 0,
    chaseSpeedChangeCycles: 0,
    numFollower: 0,
    cash: 0,               // amount of cash

    ALLEXPERIENCE    Exp;                 // experience status
    exp: [],               // experience status

    POISONSTATUS     rgPoisonStatus[MAX_POISONS][MAX_PLAYABLE_PLAYER_ROLES]; // poison status
    poisonStatus: [],      // poison status

    INVENTORY        rgInventory[MAX_INVENTORY];  // inventory status
    inventory: [],         // inventory status
    */

    objectDesc: null,
    frameNum: 0
  });
  if (!PAL_CLASSIC) {
    //#ifndef PAL_CLASSIC
    //   BYTE             bBattleSpeed;        // Battle Speed (1 = Fastest, 5 = Slowest)
    //#endif
    Global.battleSpeed = 2;
  }

  // Open files
  var mkfs = ['FBP', 'MGO', 'BALL', 'DATA', 'F', 'FIRE', 'RGM', 'SSS', 'PAT'];
  yield ajax.loadMKF(mkfs);
  mkfs.forEach(function(name, i) {
    Files[name] = ajax.MKF[name];
  })

  Global.objectDesc = yield ui.loadObjectDesc('desc.dat');

  Global.currentSaveSlot = 1;
};

main.start = function() {
  return co(function*() {
        // 初始化公共参数
        yield main.initGlobals();
        // 初始化核心文件
        Palette.init(Files.PAT);
        // var surf = new Surface(document.getElementById('cvs'), 320, 200, document.getElementById('debug'));
        var surf = new Surface(document.getElementById('cvs'), 320, 200, null);
        // 初始化UI，内含初始化文字
        yield ui.init(surf); 
        // TODO: 我也不知道RNG文件是什么
        yield rng.init(surf);
        // 初始化按钮
        input.init();
        // 软星商标开场动画
        yield welcome.trademarkScreen(surf); 
        // 游戏开场动画
        yield welcome.splashScreen(surf); 
        // 初始化场景
        yield scene.init(surf); 
        // 再次初始化按钮，怀疑是重复了。稍后删除试试如何
        input.init();
        // 初始化游戏
        yield game.init(surf);
        // 启动游戏
        yield game.main(); 
  });
};

export default main;
