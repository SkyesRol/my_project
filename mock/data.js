import Mock from 'mockjs';
import pkg from 'jsonwebtoken';
const secret = '!&codeFig!';
const { sign, verify } = pkg;
const getImages = (page, pageSize = 10) => {
    return Array.from({ length: pageSize }, (_, i) => ({
        // 索引唯一
        id: `${page}-${i}`,
        height: Mock.Random.integer(300, 600),
        url: Mock.Random.image('300x400', Mock.Random.color(), '#fff', 'img'),

    }))
}
export default [
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
    {
        url: '/api/login',
        method: 'post',
        timeout: 2000, // 请求耗时
        response: (req, res) => {
            // req,username,password
            const { username, password } = req.body;
            if (username !== 'Skye' || password !== '123456') {
                return {
                    code: 1,
                    msg: '登录失败'
                }
            }
            // json用户数据
            const token = sign({
                user: {
                    id: 114514,
                    username: 'Skye',
                    password: '123456'
                }
            }, secret, {
                expiresIn: 86400
            })
            console.log(token, '-----------')
            return {
                token,
                data: {
                    id: 114514,
                    username: 'Skye',
                    password: '123456'
                }
            }
        }
    },
    {
        url: '/api/user',
        method: 'get',
        response: (req, res) => {
            // 用户端 token 放在headers里面
            // JWT比较安全，如果直接写在cookie就跟裸奔一样了
            let token = req.headers["authorization"].split(' ')[1];
            console.log(token);

            if (!token) {
                return {
                    code: 1,
                    msg: 'Missing token'
                }

            }

            try {
                const decodeUser = verify(token, secret);
                console.log(decodeUser, 'from decodeUser');
                return {
                    code: 0,
                    msg: '登录成功',
                    data: decodeUser.user
                }
            } catch (err) {
                console.log(err);

                return {
                    code: 1,
                    msg: 'Invalid token'
                }
            }


        }
    }
]