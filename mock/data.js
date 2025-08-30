import Mock from 'mockjs';

// Setup production mock server
export function setupProdMockServer() {
  if (typeof window !== 'undefined') {
    // Only run in browser environment
    const mockData = mockConfig;
    mockData.forEach(({ url, method, response }) => {
      Mock.mock(new RegExp(url.replace(/\/:/g, '/\\w+')), method, response);
    });
  }
}

const getImages = (page, pageSize = 10) => {
    return Array.from({ length: pageSize }, (_, i) => ({
        // 索引唯一
        id: `${page}-${i}`,
        height: Mock.Random.integer(300, 600),
        url: Mock.Random.image('300x400', Mock.Random.color(), '#fff', 'img'),

    }))
}
const mockConfig = [
    {
        url: '/api/tweets',
        method: 'get',
        timeout: 1000,
        response: ({ query }) => {
            const page = Number(query.page) || 1;
            const pageSize = 10;
            const tweets = Array.from({ length: pageSize }, (_, i) => {
                const randomData = Mock.mock({
                    id: `tweet_${Date.now()}_${page}_${i}`,
                    user: {
                        id: '@id',
                        name: '@cname',
                        username: '@word(3,8)',
                        avatar: Mock.Random.image('40x40', Mock.Random.color(), '#fff', 'png', '@first')
                    },
                    content: '@cparagraph(1,3)',
                    timestamp: '@datetime("yyyy-MM-dd HH:mm:ss")',
                    likes: '@integer(0, 999)',
                    retweets: '@integer(0, 99)',
                    comments: '@integer(0, 50)',
                    'images|0-3': [{
                        url: Mock.Random.image('300x200', Mock.Random.color(), '#fff', 'jpg'),
                        alt: '@ctitle(3,6)'
                    }]
                });
                return randomData;
            });
            return {
                code: 0,
                data: tweets
            }
        }
    },
    {
        url: '/api/search',
        method: 'get',
        timeout: 3000,
        response: (req, res) => {
            // ?keyword=xxxx
            const keyword = req.query.keyword;
            let num = Math.floor(Math.random() * 10);
            let list = [];
            for (let i = 0; i < num; i++) {
                const randomData = Mock.mock({
                    title: '@ctitle(3,6)',

                })
                console.log(randomData);
                list.push(`${randomData.title}${keyword}`)
            }
            return {
                code: 0,
                data: list

            }
        }

    },
    {

        url: '/api/hotlist',
        method: 'get',
        timeout: 3000,
        response: (req, res) => {
            return {
                code: 0,
                data: [{
                    id: '101',
                    city: '北京'
                }, {
                    id: '102',
                    city: '上海'
                }, {
                    id: '103',
                    city: '广州'
                }, {
                    id: '104',
                    city: '深圳'
                }]
            }
        }

    },
    {
        url: '/api/detail/:id',
        method: 'get',
        timeout: 1000,
        response: (req, res) => {
            const randomData = Mock.mock({
                title: '@ctitle(5, 10)',
                price: '@integer(60, 100)',
                desc: '@cparagraph(10,30)',
                images: [
                    {
                        url: 'https://img.36krcdn.com/hsossms/20250729/v2_17dc4793268c46558e68355c5b25a55d@000000@ai_oswg369871oswg1536oswg722_img_000~tplv-1marlgjv7f-ai-v3:600:400:600:400:q70.jpg?x-oss-process=image/format,webp',
                        alt: '@ctitle(5, 10)'
                    },
                    {
                        url: 'https://img.36krcdn.com/hsossms/20250729/v2_17dc4793268c46558e68355c5b25a55d@000000@ai_oswg369871oswg1536oswg722_img_000~tplv-1marlgjv7f-ai-v3:600:400:600:400:q70.jpg?x-oss-process=image/format,webp',
                        alt: '@ctitle(5, 10)'
                    },
                    {
                        url: 'https://img.36krcdn.com/hsossms/20250729/v2_17dc4793268c46558e68355c5b25a55d@000000@ai_oswg369871oswg1536oswg722_img_000~tplv-1marlgjv7f-ai-v3:600:400:600:400:q70.jpg?x-oss-process=image/format,webp',
                        alt: '@ctitle(5, 10)'
                    },
                ]
            })

            return {
                code: 0,
                data: randomData
            }
        }
    },
    {
        // ?page=1 queryStrings
        url: '/api/images',
        method: 'get',
        timeout: 1000,
        response: ({ query }) => {
            const page = Number(query.page) || 1;
            return {
                code: 0,
                data: getImages(page)
            }
        }
    },
]

export default mockConfig;
