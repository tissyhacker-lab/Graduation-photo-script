export const project = {
  title: '毕业照拍摄脚本',
  tagline: '',
  location: '求是大讲堂 / 主图 / 东教 / 月牙楼 / 西教 / 启真湖 / 南大门',
  date: '2026.06.24 / 2026.06.26',
};

export const concept = {
  theme: '',
  emotions: ['松弛', '明亮', '眷恋', '自由', '轻微的鼻酸'],
  tones: ['暖白', '浅灰绿', '胶片颗粒', '低饱和', '日落金'],
};

export const timeline = [
  {
    time: '15:30',
    title: '集合与造型整理',
    detail: '确认服装、妆发、学士帽、花束和个人物品，拍摄几张自然候场照片。',
  },
  {
    time: '16:00',
    title: '主楼仪式感镜头',
    detail: '以建筑线条和台阶为背景，完成正式单人照与小组合影。',
  },
  {
    time: '16:50',
    title: '林荫道行走段落',
    detail: '拍摄慢走、回头、聊天、掷帽前的轻松过渡画面。',
  },
  {
    time: '17:40',
    title: '礼堂外阶梯群像',
    detail: '安排朋友互动、队形变化和毕业帽抛起镜头。',
  },
  {
    time: '18:30',
    title: '天台黄昏收尾',
    detail: '利用低角度夕阳拍摄剪影、背影和最终情绪镜头。',
  },
];

export const shots = [
  {
    id: 'S01',
    place: '求是大讲堂 Qiushi Lecture Hall',
    folder: 'Qiushi Lecture Hall',
    framing: '中远景',
    description: '以求是大讲堂作为第一视觉记忆点，突出毕业照的仪式感。',
    action: '人物自然站立、慢走、回头，保留轻松的笑和互动。',
    composition: '利用建筑入口和台阶线条做框架，人物居中或略偏一侧，保留干净留白。',
    light: '优先选择柔和自然光，必要时用反光板补亮面部。',
    props: '花束、学士帽',
    mood: ['正式', '从容', '明亮'],
    note: '先拍标准毕业照，再补拍更松弛的行走和侧身版本。',
  },
  {
    id: 'S02',
    place: '主图 Central Lib',
    folder: 'Central Lib',
    framing: '中景 / 近景',
    description: '利用主图建筑空间、窗边光线和走廊纵深，拍出安静的校园氛围。',
    action: '靠窗、看向远处、整理头发或学士帽，动作保持自然。',
    composition: '用窗框、走廊线条或墙面做几何构图，画面保持简洁。',
    light: '窗边自然光为主，避免顶光造成面部阴影。',
    props: '学士帽、书本、花束',
    mood: ['安静', '温柔', '私人感'],
    note: '重点拍半身和细节，适合做组图里的情绪过渡。',
  },
  {
    id: 'S03',
    place: '东教 East Teaching Building',
    folder: 'East Teaching Building',
    framing: '中景 / 全景',
    description: '围绕东教的楼梯和楼梯间形成一组有层次的校园建筑场景。',
    action: '上下楼梯、倚靠扶手、转身回看，动作保持轻松自然。',
    composition: '利用楼梯的斜线、转角和墙面留白制造节奏感。',
    light: '楼梯间优先找侧光或窗边光，户外楼梯避开强烈顶光。',
    props: '花束、学士帽、书本',
    mood: ['学院感', '轻松', '层次'],
    subLocations: ['东二麦斯旁边红棕大楼梯', '东二麦斯威后面上去的小楼梯', '东教楼梯间'],
    note: '这里适合多拍动作变化，三处楼梯可以做成一组连贯分镜。',
  },
  {
    id: 'S04',
    place: '月牙楼 Moon Building',
    folder: 'Moon Building',
    framing: '中远景 / 环境人像',
    description: '利用月牙楼的建筑轮廓和空间曲线，呈现更柔和的校园记忆。',
    action: '慢走、回头、站定看向远处，动作简洁克制。',
    composition: '让建筑轮廓成为背景主线，人物放在画面一侧或中心轴附近。',
    light: '自然散射光为主，保留建筑表面的柔和质感。',
    props: '花束、学士帽',
    mood: ['安静', '温柔', '留白'],
    note: '适合拍单人照和双人互动照，画面不要太满。',
  },
  {
    id: 'S05',
    place: '西教 West Teaching Building',
    folder: 'West Teaching Building',
    framing: '中景 / 建筑人像',
    description: '以西教建筑线条作为背景，补充更清爽的教学楼氛围。',
    action: '靠墙、扶栏、低头整理衣摆或学士帽。',
    composition: '使用墙面、门框或栏杆线条切分画面，保持干净秩序。',
    light: '选择阴影边缘或柔光区域，避免脸部明暗反差过大。',
    props: '学士帽、毕业证书夹',
    mood: ['清爽', '日常', '校园感'],
    note: '适合拍摄半身、侧身和走廊过渡镜头。',
  },
  {
    id: 'S06',
    place: '启真湖 Qizhen Lake',
    folder: 'Qizhen Lake',
    framing: '远景 / 情绪照',
    description: '借助湖面、树影和开阔空间，形成更舒展的毕业氛围。',
    action: '沿湖慢走、坐在湖边、看向水面或与朋友自然交谈。',
    composition: '保留湖面和天空留白，人物占画面下方或侧边。',
    light: '下午柔光或傍晚侧逆光，注意水面反光不要过曝。',
    props: '花束、学士帽、透明雨伞',
    mood: ['自由', '舒展', '清透'],
    note: '适合作为情绪段落，拍一些背影和远景。',
  },
  {
    id: 'S07',
    place: '南大门 South Gate',
    folder: 'South Gate',
    framing: '全景 / 群像',
    description: '以南大门作为收尾场景，呈现校园出口与毕业节点的关系。',
    action: '人物并排行走、回头挥手、朋友间自然聊天或轻微奔跑。',
    composition: '保留门体和道路空间，人物放在画面下方或中轴线附近。',
    light: '下午或傍晚自然光，尽量避开强烈直射造成的眯眼。',
    props: '花束、学士帽、毕业证书夹',
    mood: ['自由', '纪念感', '告别'],
    note: '适合作为最后一组照片，拍摄正式合影和动态离场两种版本。',
  },
];

export const moodboard = [
  {
    title: '服装+姿势参考',
    subtitle: 'Cloth and Pose',
    type: 'clothPose',
  },
  {
    title: '妆造参考',
    subtitle: 'Makeup and Styling',
    type: 'makeup',
  },
];

export const checklist = {
  equipment: ['相机机身 x2', '35mm / 50mm 镜头', '反光板', '备用电池', '高速存储卡'],
  wardrobe: ['学士服', '白衬衫', '浅色裙装或西装裤', '舒适备用鞋', '发夹与补妆包'],
  props: ['花束', '毕业证书夹', '气球', '帆布包', '透明雨伞'],
  crew: ['摄影师：镜头与节奏控制', '助理：补光、道具、队形', '造型：服装细节与妆发', '统筹：时间线与集合提醒'],
};
