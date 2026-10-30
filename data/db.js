/* ============================================================
   陶元的玩具商城 · Mock 数据库（纯 JSON 数据，双击 HTML 即可运行）
   ------------------------------------------------------------
   这个文件就是「后台数据库」：商品、楼层、优惠券全在这里。
   改这个文件 = 后台改配置（比如换 Banner、调价格、加商品）。
   首页是「楼层化」的：页面只是渲染器，楼层顺序/内容由
   DB.floors 决定 —— 这是照抄华为商城的核心架构。
   ============================================================ */

/* 玩具图片统一用 AI 生成接口（prompt 不同，图不同，链接即缓存键） */
function toyImg(prompt, size) {
  size = size || 'square';
  return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
    encodeURIComponent(prompt) + '&image_size=' + size;
}

window.DB = {

  /* ---------- 运营位：搜索热词（照抄华为「只读搜索框 + 热词轮播」） ---------- */
  hotWords: ['小黄鸭洗澡玩具', '安抚睡觉小兔', '软胶积木50粒', '早教故事机', '儿童滑步车', '泡泡机'],

  /* ---------- 顶部轮播 Banner（后台可配置：图 + 文案 + 跳转） ---------- */
  banners: [
    {
      img: toyImg('cheerful kids toy store promotional banner, cute teddy bear and colorful building blocks on soft candy pastel clouds background, warm cream yellow and pink palette, kawaii style, empty space on left side for text, e-commerce hero banner', 'landscape_16_9'),
      title: '陶陶出生礼 · 全场满199减30',
      sub: '新手爸妈的第一份玩具清单',
      link: 'list.html?age=0-1岁',
      bg: '#FFE4EE'
    },
    {
      img: toyImg('pastel wood blocks and rainbow stacking toys flat lay, soft mint and peach colors, cute nursery style, top view, e-commerce banner with space on right', 'landscape_16_9'),
      title: '积木世界 · 第二件半价',
      sub: '软胶积木 / 大颗粒 / 磁力片',
      link: 'list.html?cat=积木拼搭',
      bg: '#E3F4FD'
    },
    {
      img: toyImg('cute plush bunny and bear toys sitting on crescent moon, dreamy pastel night sky with stars, soft illustration style, kids e-commerce banner', 'landscape_16_9'),
      title: '安抚好物 · 陪宝宝一觉到天亮',
      sub: '心跳声安抚兔 · 云朵抱枕毯',
      link: 'list.html?cat=毛绒安抚',
      bg: '#FFF3D6'
    }
  ],

  /* ---------- 金刚区（8宫格，每个入口可配置跳转） ---------- */
  kingkong: [
    { icon: '⚡', bg: '#FFF3D6', label: '限时秒杀', link: '#seckill' },
    { icon: '✨', bg: '#FFE4EE', label: '新品首发', link: 'list.html?sort=new' },
    { icon: '🍼', bg: '#E3F4FD', label: '摇铃牙胶', link: 'list.html?cat=摇铃牙胶' },
    { icon: '🧱', bg: '#E6F6E6', label: '积木世界', link: 'list.html?cat=积木拼搭' },
    { icon: '🧸', bg: '#FFE8DB', label: '毛绒星球', link: 'list.html?cat=毛绒安抚' },
    { icon: '🧩', bg: '#F0E9FD', label: '早教益智', link: 'list.html?cat=早教益智' },
    { icon: '🎫', bg: '#FFE4EE', label: '宝妈领券', link: 'member.html' },
    { icon: '♻️', bg: '#E6F6E6', label: '旧玩具回收', link: 'member.html' }
  ],

  /* ---------- 内容楼层：育儿种草（照抄华为「内容与商品混排」） ---------- */
  articles: [
    {
      img: toyImg('mom and baby reading a picture book together on cozy pastel rug, warm soft illustration, peach and cream tones', 'landscape_16_9'),
      title: '1岁前别乱买！这5类玩具闭眼入',
      tag: '选购指南'
    },
    {
      img: toyImg('cute toddler playing with colorful stacking cups on playmat, bright pastel illustration, joyful mood', 'landscape_16_9'),
      title: '抓握敏感期怎么陪玩？3个亲子游戏',
      tag: '育儿干货'
    }
  ],

  /* ---------- 商品库（24 个 SKU）----------
     tags 类型：new 新品 / hot 热卖 / cert 认证 / promo 促销 / gift 赠品 / ship 服务
     opts：SKU 选择组（颜色/款式，最多两组，照抄华为「颜色/内存版本」面板） */
  products: [
    /* ---- 摇铃牙胶（0-1岁）---- */
    { id: 'p01', cat: '摇铃牙胶', age: '0-1岁', name: '小熊摇铃牙胶套装', point: '啃咬不伤牙龈 | 食品级硅胶',
      price: 49, line: 69, stock: 99, sales: 23000, rating: 4.9, reviewsN: 8632, isNew: false,
      img: toyImg('cute pastel bear shaped baby rattle teether set, food grade silicone, cream yellow mint pink colors, soft studio product photography, clean light background'),
      tags: [['cert', '3C认证'], ['promo', '限时直降'], ['gift', '送收纳袋']],
      opts: [{ label: '颜色', values: ['奶油黄', '薄荷绿', '樱花粉'] }],
      material: '食品级液态硅胶', cert: '国标GB6675 · 3C', origin: '中国广东',
      desc: '一握一个响，出牙期宝宝的最爱。360°无缝设计，水煮消毒不变形，小手好抓握。',
      reviewList: [
        { u: '朵朵妈妈', c: '拿到手先煮了一下消毒，没有异味，宝宝抓着就不撒手，摇起来咯咯笑。', tags: ['无异味', '好抓握'], star: 5 },
        { u: '元宝爸爸', c: '软硬适中，出牙期啃个不停，清洗也方便，这个价位很值。', tags: ['性价比高'], star: 5 }
      ] },
    { id: 'p02', cat: '摇铃牙胶', age: '0-1岁', name: '曼哈顿手抓球软胶玩具', point: '多触点刺激触觉 | 可冷藏缓解牙痒',
      price: 39, line: 55, stock: 88, sales: 15000, rating: 4.8, reviewsN: 5210, isNew: false,
      img: toyImg('colorful manhattan baby hand grab ball toy, soft silicone tubes in pastel rainbow colors, clean product photo, light background'),
      tags: [['cert', '3C认证'], ['ship', '送运费险']],
      opts: [{ label: '颜色', values: ['彩虹款', '马卡龙款'] }],
      material: '食品级TPU软胶', cert: '国标GB6675 · 3C', origin: '中国浙江',
      desc: '细管设计刚好卡住小手指，练习抓握的教科书级玩具。冷藏后变凉，出牙期随身带。',
      reviewList: [
        { u: '小满妈妈', c: '冷藏完给宝宝咬，瞬间安静了，出门必带。', tags: ['缓解牙痒'], star: 5 }
      ] },
    { id: 'p03', cat: '摇铃牙胶', age: '0-1岁', name: '丛林动物触摸布书', point: '响纸+BB器 | 洗了不掉色',
      price: 29, line: 39, stock: 120, sales: 30000, rating: 4.9, reviewsN: 9870, isNew: false,
      img: toyImg('soft cloth book for babies with jungle animals, crinkle fabric pages, pastel colors, cute embroidery details, product photography'),
      tags: [['hot', '月销3万+'], ['cert', '3C认证']],
      opts: [{ label: '款式', values: ['丛林款', '海洋款', '农场款'] }],
      material: '棉布+涤纶填充', cert: '国标GB6675 · 3C', origin: '中国山东',
      desc: '撕不烂、可水洗的「第一本书」。每页藏一个小机关：响纸、BB器、牙胶角。',
      reviewList: [
        { u: '布布奶奶', c: '小孙女天天啃，啃完直接水洗，跟新的一样。', tags: ['可水洗'], star: 5 }
      ] },

    /* ---- 积木拼搭（1-3岁）---- */
    { id: 'p04', cat: '积木拼搭', age: '1-2岁', name: '软胶积木 50粒装', point: '软的！砸脚不疼 | 啃咬也放心',
      price: 89, line: 119, stock: 66, sales: 18000, rating: 4.9, reviewsN: 7364, isNew: false,
      img: toyImg('soft rubber building blocks set for toddlers, 50 pieces in pastel candy colors, arranged in a cute pile, product photography on light background'),
      tags: [['hot', '热卖TOP1'], ['cert', '3C认证'], ['promo', '第二件半价']],
      opts: [{ label: '规格', values: ['50粒装', '80粒装(+30元)'] }],
      material: '食品级EVA软胶', cert: '国标GB6675 · 3C', origin: '中国广东',
      desc: '1岁就能玩的积木：软、轻、无声，拼搭失败了也不哭。边缘圆角，口欲期放心啃。',
      reviewList: [
        { u: '年年妈妈', c: '比硬积木友好太多，扔得到处都是也不怕砸坏地板。', tags: ['安全'], star: 5 },
        { u: '糖糖爸爸', c: '50粒够玩一晚上，亲子拼搭出片率很高。', tags: ['亲子互动'], star: 4 }
      ] },
    { id: 'p05', cat: '积木拼搭', age: '1-2岁', name: '大颗粒动物积木桶', point: '带收纳桶 | 拼完变动物园',
      price: 69, line: 99, stock: 77, sales: 9000, rating: 4.8, reviewsN: 3210, isNew: false,
      img: toyImg('toddler large particle building blocks bucket set with cute animal shapes, elephant lion giraffe, pastel colors, product photography'),
      tags: [['cert', '3C认证'], ['gift', '送贴纸书']],
      opts: [{ label: '款式', values: ['动物园款', '交通城款'] }],
      material: 'ABS环保塑料', cert: '国标GB6675 · 3C', origin: '中国浙江',
      desc: '大颗粒防吞咽，动物造型自带故事感。玩完装回桶里，收纳 chores 变成游戏。',
      reviewList: [
        { u: '禾禾妈妈', c: '大象长鼻子拼出来那一刻，宝宝举着满屋跑。', tags: ['可爱'], star: 5 }
      ] },
    { id: 'p06', cat: '积木拼搭', age: '2-3岁', name: '彩窗磁力片 60件套', point: '透光磁吸 | 拼出彩虹小房子',
      price: 129, line: 179, stock: 45, sales: 8000, rating: 4.9, reviewsN: 4520, isNew: true,
      img: toyImg('magnetic tiles building set transparent colorful windows, rainbow house construction, bright pastel colors, product photography'),
      tags: [['new', '新品'], ['cert', '3C认证'], ['promo', '满199减30']],
      opts: [{ label: '规格', values: ['60件套', '100件套(+60元)'] }],
      material: 'ABS+磁铁', cert: '国标GB6675 · 3C', origin: '中国浙江',
      desc: '2岁+进阶款：磁吸即拼即成，透光拼搭能玩出「光影教室」。附拼搭图册。',
      reviewList: [
        { u: '一一爸爸', c: '对着窗户拼彩色窗户，宝宝能安静半小时，值回票价。', tags: ['专注力'], star: 5 }
      ] },

    /* ---- 毛绒安抚 ---- */
    { id: 'p07', cat: '毛绒安抚', age: '0-1岁', name: '安抚睡觉小兔 · 心跳声版', point: '模拟心跳白噪音 | 哄睡神器',
      price: 79, line: 99, stock: 58, sales: 12000, rating: 4.8, reviewsN: 6621, isNew: false,
      img: toyImg('soft cream colored plush bunny sleeping aid toy for babies with closed eyes, long ears, sitting on a small cloud cushion, dreamy soft product photography'),
      tags: [['hot', '哄睡神器'], ['ship', '送运费险'], ['gift', '送备用电池']],
      opts: [{ label: '款式', values: ['奶油兔', '星星熊', '月亮猫'] }],
      material: '短毛绒+电子元件', cert: '国标GB6675 · 3C', origin: '中国江苏',
      desc: '肚子里藏着一颗「心跳」，模拟子宫声音，白噪音+呼吸灯双模式，哄睡成功率翻倍。',
      reviewList: [
        { u: '晚安妈妈', c: '开3档心跳+白噪音，以前哄1小时现在10分钟，救命。', tags: ['哄睡有效'], star: 5 },
        { u: '奶糖爸爸', c: '毛毛很软不掉毛，就是定时关机再长点更好。', tags: ['质感好'], star: 4 }
      ] },
    { id: 'p08', cat: '毛绒安抚', age: '1-2岁', name: '商城吉祥物 · 抱抱熊陶陶', point: '本店限定IP | 40cm大号可抱',
      price: 59, line: 79, stock: 200, sales: 5000, rating: 5.0, reviewsN: 1520, isNew: true,
      img: toyImg('cute honey brown teddy bear mascot plush toy, chubby and soft, wearing a tiny blue bib with letter T, big smile, product photography on cream background'),
      tags: [['new', '本店限定'], ['gift', '送定制T恤']],
      opts: [{ label: '尺寸', values: ['25cm', '40cm(+20元)'] }],
      material: '短毛绒+PP棉', cert: '国标GB6675 · 3C', origin: '中国江苏',
      desc: '本店吉祥物「陶陶」公仔，圆滚滚一抱一大个，配小围兜刺绣，可机洗。',
      reviewList: [
        { u: '陶元本人', c: '以我名字命名的熊，必须买！手感确实好。', tags: ['限定'], star: 5 }
      ] },
    { id: 'p09', cat: '毛绒安抚', age: '1-2岁', name: '云朵抱枕毛绒毯两用', point: '抱枕展开变毯子 | 午睡出游两不误',
      price: 69, line: 89, stock: 90, sales: 6000, rating: 4.7, reviewsN: 2830, isNew: false,
      img: toyImg('fluffy cloud shaped pillow that unfolds into a soft pastel blanket, cream pink and blue, cozy nursery product photography'),
      tags: [['cert', '3C认证'], ['ship', '7天无理由']],
      opts: [{ label: '颜色', values: ['奶油白', '天空蓝', '樱花粉'] }],
      material: '牛奶绒', cert: '国标GB18401 A类', origin: '中国江苏',
      desc: '云朵造型抱着睡，拉开是一条100×140cm小毯子，推车午睡、空调房必备。',
      reviewList: [
        { u: '橙子妈妈', c: '幼儿园午睡人手一条，洗完依然蓬松。', tags: ['实用'], star: 4 }
      ] },

    /* ---- 早教益智 ---- */
    { id: 'p10', cat: '早教益智', age: '1-2岁', name: '早教故事机 · 小鹿AI问答', point: 'AI对话+儿歌故事 | 防蓝光软耳朵',
      price: 169, line: 199, stock: 40, sales: 7000, rating: 4.8, reviewsN: 5420, isNew: false,
      img: toyImg('cute deer shaped early education story machine toy for toddlers, soft fabric ears, smiling LED face screen, pastel colors, product photography'),
      tags: [['hot', '宝妈口碑款'], ['cert', '3C认证'], ['promo', '12期免息']],
      opts: [{ label: '款式', values: ['小鹿款', '小鲸鱼款'] }, { label: '内容', values: ['标准版', '英语启蒙包(+40元)'] }],
      material: 'ABS+硅胶耳', cert: '国标GB6675 · 3C', origin: '中国深圳',
      desc: '会聊天的故事机：儿歌、国学、英语启蒙三大内容库，微信远程点播，长辈也能操作。',
      reviewList: [
        { u: '米粒妈妈', c: '宝宝每天早上自己抱着点歌，还能跟它对话，很惊喜。', tags: ['内容丰富'], star: 5 }
      ] },
    { id: 'p11', cat: '早教益智', age: '1-2岁', name: '六面体多功能游戏桌', point: '6面×6种玩法 | 一桌用到3岁',
      price: 149, line: 189, stock: 35, sales: 4000, rating: 4.7, reviewsN: 2980, isNew: false,
      img: toyImg('colorful activity cube toy for toddlers with six playing sides, gears beads shape sorter xylophone, pastel wooden style, product photography'),
      tags: [['cert', '3C认证'], ['promo', '满199减30']],
      opts: [{ label: '颜色', values: ['缤纷版', '马卡龙版'] }],
      material: '实木+ABS', cert: '国标GB6675 · 3C', origin: '中国浙江',
      desc: '绕珠、齿轮、形状配对、敲琴、翻书、滑轨道——六个面玩一整年， standing 高度刚好扶站。',
      reviewList: [
        { u: '可乐奶奶', c: '孙子来了直奔这张桌子，比手机管用。', tags: ['玩法多'], star: 5 }
      ] },
    { id: 'p12', cat: '早教益智', age: '2-3岁', name: '形状配对智慧盒', point: '认识形状颜色 | 锻炼手眼协调',
      price: 49, line: 65, stock: 150, sales: 11000, rating: 4.8, reviewsN: 3670, isNew: false,
      img: toyImg('wooden shape sorting puzzle box for toddlers, colorful geometric blocks pastel painted, cute design, product photography'),
      tags: [['cert', '3C认证'], ['ship', '送运费险']],
      opts: [],
      material: '榉木+水性漆', cert: '国标GB6675 · 3C', origin: '中国浙江',
      desc: '12块几何积木对号入座，从乱塞到精准投放，是宝宝空间思维的第一步。',
      reviewList: [
        { u: '桃子妈妈', c: '水性漆没味道，边角打磨得很滑，2岁半玩得转。', tags: ['做工好'], star: 5 }
      ] },
    { id: 'p13', cat: '早教益智', age: '1-2岁', name: '儿童八音小敲琴台', point: '音准在线 | 附5首简谱卡',
      price: 59, line: 79, stock: 80, sales: 5200, rating: 4.6, reviewsN: 1980, isNew: false,
      img: toyImg('colorful toddler xylophone knocking piano toy with two small mallets, pastel rainbow keys, cute round design, product photography'),
      tags: [['cert', '3C认证'], ['gift', '送乐谱卡']],
      opts: [],
      material: '铝板+榉木', cert: '国标GB6675 · 3C', origin: '中国浙江',
      desc: '八音准，不刺耳。敲琴是节奏感启蒙第一步，附《小星星》等5首入门简谱卡。',
      reviewList: [
        { u: '朵拉爸爸', c: '音准出乎意料，就是敲得欢的时候有点吵（笑）。', tags: ['音准'], star: 4 }
      ] },

    /* ---- 洗澡戏水 ---- */
    { id: 'p14', cat: '洗澡戏水', age: '0-1岁', name: '小黄鸭洗澡玩具 4只装', point: '底部无孔不进水 | 不发霉',
      price: 25, line: 35, stock: 300, sales: 50000, rating: 4.9, reviewsN: 12890, isNew: false,
      img: toyImg('four cute yellow rubber duck bath toys in different sizes, one wearing tiny crown, no holes design, bright cheerful product photography on white'),
      tags: [['hot', '月销5万+'], ['cert', '3C认证'], ['promo', '买二送一']],
      opts: [],
      material: '食品级PVC', cert: '国标GB6675 · 3C', origin: '中国广东',
      desc: '底部全封闭不进水，从根上杜绝「挤出来一霉水」。大小四只，捏起来声音各不同。',
      reviewList: [
        { u: '阿宝妈妈', c: '无孔设计真的绝，以前的小黄鸭里面黑乎乎的…这个放心。', tags: ['不发霉'], star: 5 }
      ] },
    { id: 'p15', cat: '洗澡戏水', age: '1-2岁', name: '喷水大象花洒', point: '电动抽水循环 | 洗头不哭闹',
      price: 35, line: 49, stock: 110, sales: 16000, rating: 4.7, reviewsN: 4530, isNew: false,
      img: toyImg('cute elephant bath shower toy spraying gentle water fountain, pastel blue and pink, floating on water, bright product photography'),
      tags: [['cert', '3C认证'], ['ship', '7天无理由']],
      opts: [{ label: '颜色', values: ['大象蓝', '大象粉'] }],
      material: 'ABS+电子泵', cert: '国标GB6675 · 3C', origin: '中国广东',
      desc: '放到水里自动循环喷泉，水流柔软，让怕洗头的宝宝把注意力放到玩水上。',
      reviewList: [
        { u: '跳跳妈妈', c: '从此洗头靠抢（抢着洗），水流很温柔。', tags: ['洗头神器'], star: 5 }
      ] },
    { id: 'p16', cat: '洗澡戏水', age: '1-2岁', name: '洗澡贴贴乐泡沫玩具', point: '湿水即贴瓷砖 | 益母草粉无毒材质',
      price: 29, line: 39, stock: 140, sales: 9800, rating: 4.6, reviewsN: 3120, isNew: false,
      img: toyImg('foam bath stickers toys, cute ocean animals shapes, pink blue yellow foam pieces sticking on tiled wall with soap bubbles, bright product photography'),
      tags: [['promo', '满99减10']],
      opts: [{ label: '款式', values: ['海洋款', '交通款', '恐龙款'] }],
      material: 'EVA泡沫', cert: '国标GB6675 · 3C', origin: '中国浙江',
      desc: '沾水就能贴上墙，拼一幅海底世界；洗完一收，下次接着编新故事。',
      reviewList: [
        { u: '泡泡爸爸', c: '娃每天洗澡像上手工课，瓷砖墙面已经贴满。', tags: ['耐玩'], star: 4 }
      ] },

    /* ---- 学步滑行 ---- */
    { id: 'p17', cat: '学步滑行', age: '1-2岁', name: '多功能防O型腿学步车', point: '三档调速防侧翻 | 推行+游戏板两用',
      price: 199, line: 259, stock: 28, sales: 3500, rating: 4.8, reviewsN: 2140, isNew: false,
      img: toyImg('modern baby push walker with activity panel, wide stable base, pastel mint and cream colors, cute rounded design, product photography in bright nursery'),
      tags: [['promo', '限时直降60'], ['cert', '3C认证'], ['gift', '送防滑袜']],
      opts: [{ label: '颜色', values: ['薄荷绿', '奶油黄'] }],
      material: 'ABS+橡塑轮', cert: '国标GB6675 · 3C', origin: '中国浙江',
      desc: '低速防冲坡设计，学步不「飞车」。前板是嵌圈+齿轮游戏台，不走了也能站着玩。',
      reviewList: [
        { u: '安安妈妈', c: '轮子有阻力不溜太快，宝宝推着满客厅巡逻很有安全感。', tags: ['稳'], star: 5 }
      ] },
    { id: 'p18', cat: '学步滑行', age: '2-3岁', name: '儿童滑步车 · 小恐龙款', point: '限位转向防甩头 | 3秒调节车把',
      price: 219, line: 289, stock: 22, sales: 2800, rating: 4.9, reviewsN: 1870, isNew: true,
      img: toyImg('toddler balance bike no pedal in cute dinosaur design, pastel green with tiny spikes on seat, product photography in park setting'),
      tags: [['new', '新品'], ['cert', '3C认证'], ['promo', '满199减30']],
      opts: [{ label: '颜色', values: ['恐龙绿', '恐龙黄'] }],
      material: '镁合金车架+EVA轮', cert: '国标GB6675 · 3C', origin: '中国天津',
      desc: '2岁+第一辆车：无脚踏，双脚着地即安全。限位转向防甩头，整车2.4kg娃也能拖动。',
      reviewList: [
        { u: '石头爸爸', c: '两周就会滑了，小区里最快的小恐龙。', tags: ['易上手'], star: 5 }
      ] },
    { id: 'p19', cat: '学步滑行', age: '1-2岁', name: '木马摇摇马 · 摇摇两用', point: '摇马→滑行两用 | 防后仰限位',
      price: 119, line: 149, stock: 50, sales: 4200, rating: 4.7, reviewsN: 1650, isNew: false,
      img: toyImg('cute wooden rocking horse for toddlers, cream body with pastel rainbow mane, smooth edges, product photography in bright nursery'),
      tags: [['cert', '3C认证'], ['ship', '送运费险']],
      opts: [],
      material: '实木+毛绒', cert: '国标GB6675 · 3C', origin: '中国浙江',
      desc: '底板翻过来秒变滑行车，一匹马骑到3岁。前后都有限位，摇得再疯也不翻。',
      reviewList: [
        { u: '念念妈妈', c: '先摇后滑，这个设计太懂了，等于买了两件。', tags: ['两用'], star: 4 }
      ] },

    /* ---- 音乐绘本 ---- */
    { id: 'p20', cat: '音乐绘本', age: '0-1岁', name: '有声点读绘本套装 · 10册', point: '手指点读发声 | 中英双语',
      price: 99, line: 139, stock: 70, sales: 8600, rating: 4.8, reviewsN: 3980, isNew: false,
      img: toyImg('set of interactive sound books for babies, colorful illustrated covers with animals, one book open with sound buttons, pastel colors, product photography'),
      tags: [['hot', '双语启蒙'], ['cert', '3C认证'], ['gift', '送点读笔套']],
      opts: [{ label: '套装', values: ['启蒙10册', '进阶20册(+60元)'] }],
      material: '厚纸板+电子发声', cert: '国标GB6675 · 3C', origin: '中国深圳',
      desc: '不用点读笔，手指按一按就发声。10个主题（动物/交通工具/身体…），中英各一遍。',
      reviewList: [
        { u: '糯米妈妈', c: '厚纸板撕不烂，发音标准，当睡前节目刚刚好。', tags: ['发音标准'], star: 5 }
      ] },
    { id: 'p21', cat: '音乐绘本', age: '0-1岁', name: '宝宝手拍鼓音乐台', point: '拍打有回弹 | 儿歌+音效双模式',
      price: 65, line: 85, stock: 95, sales: 7200, rating: 4.6, reviewsN: 2870, isNew: false,
      img: toyImg('cute baby drum music toy with colorful light up buttons, soft round design, pastel blue pink yellow, product photography'),
      tags: [['cert', '3C认证'], ['promo', '买二送一']],
      opts: [],
      material: 'ABS+硅胶鼓面', cert: '国标GB6675 · 3C', origin: '中国广东',
      desc: '一拍就亮灯的节奏玩具，音量三档可调（深夜也不吵），坐稳就能玩。',
      reviewList: [
        { u: '可可爸爸', c: '三档音量很贴心，晚上调最小档照样玩。', tags: ['音量可调'], star: 4 }
      ] },

    /* ---- 户外沙滩 ---- */
    { id: 'p22', cat: '户外沙滩', age: '2-3岁', name: '儿童沙滩玩具桶套装 12件', point: '软胶不划手 | 网袋收纳带走就玩',
      price: 45, line: 59, stock: 130, sales: 6800, rating: 4.7, reviewsN: 2240, isNew: false,
      img: toyImg('kids beach toy set with bucket spade rake and sand molds in pastel mesh bag, pink blue yellow, sunny beach product photography'),
      tags: [['cert', '3C认证'], ['ship', '7天无理由']],
      opts: [{ label: '颜色', values: ['粉蓝组', '黄绿组'] }],
      material: '食品级PP软胶', cert: '国标GB6675 · 3C', origin: '中国广东',
      desc: '12件套：桶、铲、耙、模具、洒水壶，配网袋。软胶材质，摔不裂也划不到手。',
      reviewList: [
        { u: '冲冲妈妈', c: '海边归来全员好评，软铲子真的不硌手。', tags: ['海边标配'], star: 5 }
      ] },
    { id: 'p23', cat: '户外沙滩', age: '2-3岁', name: '全自动小象泡泡机', point: '一手握住不漏液 | 出泡快如小雪',
      price: 59, line: 79, stock: 100, sales: 8900, rating: 4.8, reviewsN: 3560, isNew: true,
      img: toyImg('cute elephant shaped automatic bubble machine toy for kids, pastel pink, blowing a stream of bubbles in the park, joyful bright product photography'),
      tags: [['new', '新品'], ['cert', '3C认证'], ['gift', '送2瓶泡液']],
      opts: [{ label: '颜色', values: ['小象粉', '小象蓝'] }],
      material: 'ABS', cert: '国标GB6675 · 3C', origin: '中国广东',
      desc: '按住扳机狂喷泡泡，防漏液设计不脏手。追泡泡 = 最便宜的体能课。',
      reviewList: [
        { u: '念念爸爸', c: '小区社交利器，一开炮围过来五个娃。', tags: ['人气高'], star: 5 }
      ] },
    { id: 'p24', cat: '户外沙滩', age: '2-3岁', name: '拼装电动火车轨道 40件', point: '轨道随意拼 | 过山车式爬坡',
      price: 109, line: 149, stock: 38, sales: 3100, rating: 4.8, reviewsN: 1420, isNew: false,
      img: toyImg('electric toy train set with flexible track loop and small bridge, colorful train with cute face, pastel landscape, product photography'),
      tags: [['promo', '满199减30'], ['cert', '3C认证']],
      opts: [{ label: '规格', values: ['基础40件', '豪华80件(+70元)'] }],
      material: 'ABS+电子元件', cert: '国标GB6675 · 3C', origin: '中国汕头',
      desc: '软性轨道想拼圆就圆想拼8字就8字，电动小火车会爬坡过桥，附2节车厢。',
      reviewList: [
        { u: '辰辰妈妈', c: '父子俩蹲地上拼了一晚上轨道，娃的爹比娃还上头。', tags: ['上头'], star: 5 }
      ] }
  ],

  /* ---------- 限时秒杀（独立活动库存，照抄华为秒杀体系） ---------- */
  seckill: {
    endTimeOffset: 2 * 3600 * 1000 + 47 * 60 * 1000, // 距结束 2小时47分（页面打开时起算）
    items: [
      { pid: 'p01', price: 39, sold: 82 },
      { pid: 'p14', price: 19, sold: 91 },
      { pid: 'p10', price: 149, sold: 66 },
      { pid: 'p18', price: 189, sold: 47 }
    ]
  },

  /* ---------- 优惠券模板（照抄华为券规则：满减、限品类、新人券） ---------- */
  coupons: [
    { id: 'c_new',  name: '新人见面礼',   off: 20,  min: 99,  scope: '全部商品', scopeCat: null, note: '注册即送 · 全场可用' },
    { id: 'c_199',  name: '满199减30券',  off: 30,  min: 199, scope: '全部商品', scopeCat: null, note: '全场可用 · 与积分同享' },
    { id: 'c_99',   name: '满99减10券',   off: 10,  min: 99,  scope: '全部商品', scopeCat: null, note: '全场可用' },
    { id: 'c_plush',name: '毛绒8.8折券',  rate: 0.88, min: 0, scope: '限毛绒安抚类', scopeCat: '毛绒安抚', note: '限毛绒安抚商品' }
  ],

  /* ---------- 首页楼层配置（楼层化 CMS 核心：改这里=改首页，不用改代码） ---------- */
  floors: [
    { type: 'banner' },
    { type: 'kingkong' },
    { type: 'seckill' },
    { type: 'couponStrip', title: '新人礼包 · 注册领20元', sub: '100积分抵1元 · 满48包邮', link: 'member.html' },
    { type: 'productRow', title: '0-1岁 · 安抚与口欲期', ids: ['p07', 'p01', 'p03', 'p02', 'p14', 'p20'] },
    { type: 'productGrid', title: '1-2岁 · 启蒙必买榜', ids: ['p04', 'p10', 'p17', 'p05', 'p11', 'p13'] },
    { type: 'content' },
    { type: 'productGrid', title: '2-3岁 · 进阶小玩家', ids: ['p18', 'p06', 'p24', 'p23', 'p22', 'p12'] },
    { type: 'footer' }
  ],

  /* ---------- 默认收货地址 ---------- */
  defaultAddress: {
    name: '陶元妈妈', phone: '138****8888',
    text: '上海市徐汇区樱花路 520 弄 8 号楼 3 层「玩具之家」'
  },

  categories: {
    byCat: [
      { icon: '🍼', name: '摇铃牙胶', desc: '口欲期 · 触觉启蒙' },
      { icon: '🧱', name: '积木拼搭', desc: '空间思维 · 亲子互动' },
      { icon: '🧸', name: '毛绒安抚', desc: '哄睡 · 陪伴' },
      { icon: '🧩', name: '早教益智', desc: '专注力 · 逻辑启蒙' },
      { icon: '🦆', name: '洗澡戏水', desc: '感官游戏 · 不怕洗头' },
      { icon: '🛴', name: '学步滑行', desc: '大运动 · 户外遛娃' },
      { icon: '🎵', name: '音乐绘本', desc: '语言启蒙 · 节奏感' },
      { icon: '🏖️', name: '户外沙滩', desc: '社交利器 · 体能消耗' }
    ],
    byAge: [
      { icon: '👶', name: '0-1岁', desc: '安抚 · 牙胶 · 布书' },
      { icon: '🧒', name: '1-2岁', desc: '学步 · 积木 · 故事机' },
      { icon: '👦', name: '2-3岁', desc: '滑步车 · 磁力片 · 角色扮演' }
    ]
  }
};
