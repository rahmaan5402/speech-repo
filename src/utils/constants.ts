export const defaultScripts: Script[] = [
    {
        id: 1,
        content: '您好，感谢您对我们产品的关注。我是您的专属顾问，很高兴为您服务。请问您对哪方面比较感兴趣呢？',
        tags: ['开场白'],
        category: '销售'
    },
    {
        id: 2,
        content: '我理解您的顾虑，这确实是一个重要的决定。让我为您详细介绍一下我们的优势和保障措施...',
        tags: ['异议处理'],
        category: '销售'
    },
    {
        id: 3,
        content: '感谢您的耐心等待，我已经为您查询到相关信息。关于您提到的问题，我们的解决方案是...',
        tags: ['问题解答'],
        category: '客服'
    },
    {
        id: 4,
        content: '您好，感谢您对我们产品的关注。我是您的专属顾问，很高兴为您服务。请问您对哪方面比较感兴趣呢？',
        tags: ['开场白'],
        category: '销售'
    },
    {
        id: 5,
        content: '我理解您的顾虑，这确实是一个重要的决定。让我为您详细介绍一下我们的优势和保障措施...',
        tags: ['异议处理'],
        category: '营销'
    },
    {
        id: 6,
        content: '感谢您的耐心等待，我已经为您查询到相关信息。关于您提到的问题，我们的解决方案是...',
        tags: ['问题解答'],
        category: '客服'
    }
];

export const defaultTags: Tag[] = [
    {
        id: 1,
        name: '问题解答'
    },
    {
        id: 2,
        name: '开场白'
    },
    {
        id: 3,
        name: '异议处理'
    },
    {
        id: 4,
        name: '客服'
    },
    {
        id: 5,
        name: '营销'
    }
]

export const defaultCategories: Category[] = [
    {
        id: 1,
        name: '销售',
        sorted: 1
    },
    {
        id: 2,
        name: '客服',
        sorted: 2
    },
    {
        id: 3,
        name: '营销',
        sorted: 3
    },
    {
        id: 4,
        name: '其他',
        sorted: 4
    },
]

export const pageSize = 5;

export const DEFAULT_ALL = 'all';