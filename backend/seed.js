import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import connectMongoDB from './database/db.js'
import User from './model/user.model.js'
import Post from './model/post.model.js'
import Notification from './model/notification.model.js'

dotenv.config()

const usersData = [
  {
    fullname: 'Ram Prasad',
    username: 'ram',
    email: 'ram@example.com',
    password: 'password123',
    bio: 'Digital storyteller and coffee lover. Tweeting ideas, code, and travel scenes.',
    link: 'https://ramwrites.dev',
    profileImg: '/avatars/boy1.png',
    coverImg: '/cover.png',
  },
  {
    fullname: 'Shyam Singh',
    username: 'shyam',
    email: 'shyam@example.com',
    password: 'password123',
    bio: 'Product designer by day, photographer by night. UX tips, design talk, and life snapshots.',
    link: 'https://shyamsingh.design',
    profileImg: '/avatars/boy2.png',
    coverImg: '/cover.png',
  },
  {
    fullname: 'Harry Kapoor',
    username: 'harry',
    email: 'harry@example.com',
    password: 'password123',
    bio: 'Tech mentor building smart tools for creators. Sharing growth hacks, startup stories, and code.',
    link: 'https://harrykapoor.tech',
    profileImg: '/avatars/boy3.png',
    coverImg: '/cover.png',
  },
  {
    fullname: 'Kishore Verma',
    username: 'kishore',
    email: 'kishore@example.com',
    password: 'password123',
    bio: 'Travel addict and food trail curator. Capturing everyday adventures one tweet at a time.',
    link: 'https://kishoretravels.com',
    profileImg: '/avatars/girl1.png',
    coverImg: '/cover.png',
  },
  {
    fullname: 'Hitman Rao',
    username: 'Hitman',
    email: 'hitman@example.com',
    password: 'password123',
    bio: 'Startup strategist who loves bold ideas, rapid launches, and unforgettable brand stories.',
    link: 'https://hitman.work',
    profileImg: '/avatars/girl2.png',
    coverImg: '/cover.png',
  },
]

const postsData = [
  {
    username: 'ram',
    text: 'Good morning! Coffee, fresh code, and a new design idea. Ready to ship something bold today.',
    img: '/posts/post1.png',
    likesFrom: ['shyam', 'Hitman'],
  },
  {
    username: 'shyam',
    text: 'A clean UI is like a good story. Minimal, expressive, and easy to read.',
    img: null,
    likesFrom: ['ram'],
  },
  {
    username: 'harry',
    text: 'Built a new feature loop today — the product feels tighter and more intuitive already.',
    img: '/posts/post2.png',
    likesFrom: ['ram', 'kishore'],
  },
  {
    username: 'kishore',
    text: 'Sunrise by the river, travel notes, and local street food recommendations. Life is a beautiful journey.',
    img: '/posts/post3.png',
    likesFrom: [],
  },
  {
    username: 'Hitman',
    text: 'Launch day energy: set a goal, move fast, and celebrate every small win.',
    img: null,
    likesFrom: ['ram'],
  },
]

const followGraph = [
  { follower: 'ram', following: ['shyam', 'harry'] },
  { follower: 'shyam', following: ['ram', 'kishore'] },
  { follower: 'harry', following: ['kishore', 'Hitman'] },
  { follower: 'kishore', following: ['ram', 'Hitman'] },
  { follower: 'Hitman', following: ['ram', 'shyam', 'harry'] },
]

const followNotifications = [
  { from: 'ram', to: 'shyam' },
  { from: 'ram', to: 'harry' },
  { from: 'shyam', to: 'ram' },
  { from: 'shyam', to: 'kishore' },
  { from: 'harry', to: 'kishore' },
  { from: 'harry', to: 'Hitman' },
  { from: 'kishore', to: 'ram' },
  { from: 'kishore', to: 'Hitman' },
  { from: 'Hitman', to: 'ram' },
  { from: 'Hitman', to: 'shyam' },
]

const seed = async () => {
  await connectMongoDB()

  const usernames = usersData.map((user) => user.username)
  const existingUsers = await User.find({ username: { $in: usernames } })
  const existingIds = existingUsers.map((user) => user._id)

  if (existingIds.length > 0) {
    await Post.deleteMany({ user: { $in: existingIds } })
    await Notification.deleteMany({ $or: [{ from: { $in: existingIds } }, { to: { $in: existingIds } }] })
    await User.deleteMany({ _id: { $in: existingIds } })
  }

  const createdUsers = []

  for (const userData of usersData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = await User.create({
      fullname: userData.fullname,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      bio: userData.bio,
      link: userData.link,
      profileImg: userData.profileImg,
      coverImg: userData.coverImg,
      followers: [],
      following: [],
      likedPosts: [],
    })
    createdUsers.push(user)
  }

  const userMap = createdUsers.reduce((acc, user) => {
    acc[user.username] = user
    return acc
  }, {})

  const createdPosts = []

  for (const postData of postsData) {
    const user = userMap[postData.username]
    if (!user) continue

    const post = await Post.create({
      user: user._id,
      text: postData.text,
      img: postData.img,
      likes: postData.likesFrom.map((username) => userMap[username]._id),
      comments: [],
    })
    createdPosts.push(post)

    for (const likedBy of postData.likesFrom) {
      await User.findByIdAndUpdate(userMap[likedBy]._id, { $push: { likedPosts: post._id } })
    }
  }

  for (const follow of followGraph) {
    const follower = userMap[follow.follower]
    const followingUsers = follow.following.map((username) => userMap[username])

    await User.findByIdAndUpdate(follower._id, { $push: { following: followingUsers.map((user) => user._id) } })
    await Promise.all(
      followingUsers.map((followed) =>
        User.findByIdAndUpdate(followed._id, { $push: { followers: follower._id } }),
      ),
    )
  }

  await Notification.insertMany(
    followNotifications.map((notification) => ({
      from: userMap[notification.from]._id,
      to: userMap[notification.to]._id,
      type: 'follow',
      read: false,
    })),
  )

  console.log('✅ Seed completed!')
  console.log(`Created ${createdUsers.length} users and ${createdPosts.length} posts.`)
  process.exit(0)
}

seed().catch((error) => {
  console.error('Seed error:', error)
  process.exit(1)
})
