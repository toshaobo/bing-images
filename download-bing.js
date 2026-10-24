import fs from 'fs';
import path from 'path';

async function getBingWallpaper() {
  try {
    const res = await fetch('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN');
    const data = await res.json();
    if (!data.images || data.images.length === 0) return;

    const imgInfo = data.images[0];
    const imgUrl = `https://cn.bing.com${imgInfo.url}`;

    // 读取必应官方日期 (如 "20260829")
    const endDateStr = imgInfo.enddate;
    const yearStr = endDateStr.substring(0, 4);
    const monthStr = endDateStr.substring(4, 6);

    const folderName = `${yearStr}-${monthStr}`;
    const fileName = `${endDateStr}.jpg`;
    const targetDir = path.join(process.cwd(), 'images', folderName);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const savePath = path.join(targetDir, fileName);

    if (fs.existsSync(savePath)) {
      console.log(`🎵 必应官方 ${endDateStr} 壁纸已存在，无需重复更新。`);
      return;
    }

    const imgRes = await fetch(imgUrl);
    const buffer = await imgRes.arrayBuffer();
    fs.writeFileSync(savePath, Buffer.from(buffer));
    console.log(`✅ 必应壁纸下载成功！已保存至: ${targetDir}/${fileName}`);
  } catch (error) {
    console.error('❌ 抓取必应壁纸失败:', error);
  }
}

getBingWallpaper();
