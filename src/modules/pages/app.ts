import audio from "@/data/common/audio";
import elements from "@/data/common/elements";
import player from "@/data/common/player";
import verify from "@/data/common/verity";
import verifications from "@/libs/functions/verifications";
import playSound from "@/libs/functions/playSound";
import resetData from "@/libs/functions/resetData";
import refreshHistory from "@/libs/functions/refreshHistory";
import refreshStatus from "@/libs/functions/refreshStatus";
import launcher from "@/libs/functions/launcher";
import music from "./music";
import "./detailed";
import "./history";
import "./navigation";

const { nodes, resetContinueStyles, resetIndexStyles } = elements;
const run = (): void => {
  if (player.isRunning) return;
  player.isRunning = !player.isRunning;
  // 刷新状态栏
  refreshStatus();
  // 暂时关闭游戏区域验证，等待其他项目验证完毕后再次打开。
  verify.LEAVING_THE_GAME_AREA.enabled = false;
  // 反作弊验证
  verifications();
  // 打开游戏区域验证
  verify.LEAVING_THE_GAME_AREA.enabled = true;
  // 重置玩家的默认位置
  nodes.player.css({
    left: (nodes.app as any).width() / 2 - (nodes.player as any).width() / 2,
    top: nodes.app.height,
  });
  playSound({ src: audio.click });
  nodes.readme.element.fadeOut(300, () => {
    nodes.statusbar.element.animate({ height: 42 }, 300, "swing");
    nodes.player.animate(
      {
        top:
          (nodes.app as any).height() / 2 - (nodes.player as any).width() / 2,
      },
      600,
      "swing",
      launcher
    );
  });
};
nodes.readme.startButton.one("click", () => music.play()).on("click", run);
nodes.gameover.restart.on("click", () => {
  if (!player.isRunning) return;
  player.isRunning = !player.isRunning;
  resetContinueStyles();
  resetData();
  playSound({ src: audio.click });
  run();
});
nodes.gameover.backhome.on("click", () => {
  if (!player.isRunning) return;
  player.isRunning = !player.isRunning;
  resetIndexStyles();
  // 刷新历史记录
  refreshHistory();
  resetData();
  playSound({ src: audio.click });
});
