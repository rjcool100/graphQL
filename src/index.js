import {GraphQLServer} from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

const posts=[{
    id:'1',
    name:'post1',
    topic:'topic1',
    author:'1' 
},
{
    id:'2',
    name:'post2',
    topic:'topic2',
    author:'3'  
},
{
    id:'3',
    name:'post3',
    topic:'topic3',
    author:'1'    
}]

const users=[{
    id:'1',
    name:'user1',
    email:'user1@gmail.com'
},
{
    id:'2',
    name:'user2',
    email:'user2@gmail.com'   
},
{
    id:'3',
    name:'user3',
    email:'user3@gmail.com'
}]

const comments=[{
    id:'1',
    text:'comment1',
    author:'1',
    post:'1'
},
{
    id:'2',
    text:'comment2',
    author:'2',
    post:'3'
},
{
    id:'3',
    text:'comment3',
    author:'2',
    post:'3'
},
{
    id:'4',
    text:'comment4',
    author:'2',
    post:'2'
}]

const typeDefs=`
    type Query{
        greeting(name:String!):String!,
        arr:[Int!]!,
        add(numbers:[Float!]):Int!
        me:User!,
        users:[User!]!,
        post:Post!,
        comments:[Comment!]!,
        posts(query:String!):[Post!]!
    }

    type Mutation{
        createUser(name:String!,age:Int!,email:String!):User!,
        createPost(name:String!,topic:String!,author:ID!):Post!,
        createComment(text:String!,author:ID!,post:ID!):Comment!
    }

    type User{
        id: ID!,
        name:String!,
        email:String!,
        age:Int!,
        posts:[Post!]!,
        comments:[Comment!]!
    }

    type Post{
        id:ID!,
        name:String!,
        topic:String!,
        author:User!,
        comments:[Comment!]!
    }

    type Comment{
        id: ID!,
        text:String!,
        author:User!,
        post:Post!
    }
`

const resolvers={
    Query:{
        greeting(parent,args,ctx,info){
            if(args.name){
                return `hello ${args.name}`
            }
            else{
                return 'hello'
            }
        },
        users(parent,args,ctx,info){
            return users
        },
        arr(){
            return [1,2,3]
        },
        posts(parent,args,ctx,info){
            if(!args.query)
                return posts
            else{
                return posts.filter((post)=>{
                    var namematch=post.name.toLowerCase().includes(args.query.toLowerCase())
                    var topicmatch=post.topic.toLowerCase().includes(args.query.toLowerCase())
                    return namematch||topicmatch
                })
            }
        },
        comments(parent,args,ctx,info){
           return comments
        },
        add(parent,args,ctx,info){
            if(args.numbers.length===0)
            {
                return 0;
            }
            else{
                return args.numbers.reduce((sum,item)=>{
                    return sum+item
                })
            }

        },
         me(){
            return {
                id:'123',
                name:'rohit',
                age:26,
                employed:false,
                gpa:null,
                email:'test@gmail.com'
            }
        },
        post(){
            return{
                id:'234',
                name:'How to GraphQL',
                topic:'topic'
            }
        }
    },
    Mutation:{
        createUser(parent,args,ctx,info){
            const emailTaken=users.some((user)=>{
                return user.email===args.email
            })
            if(emailTaken){
                throw new Error('the email is already taken')
            }
            const user={
                id:uuidv4(),
                name:args.name,
                age:args.age,
                email:args.email
            }
            users.push(user)

            return user

        },
        createPost(parent,args,ctx,info){
            const userExists=users.some((user)=>{
                return user.id===args.author
            })
            if(!userExists){
                throw new Error('the user does not exist')
            }
            const post={
                id:uuidv4(),
                name:args.name,
                topic:args.topic,
                author:args.author
            }
            posts.push(post)

            return post

        },
        createComment(parent,args,ctx,info){
            const userExists=users.some((user)=>{
                return user.id===args.author
            })
            const postExists=posts.some((post)=>{
                return post.id===args.post
            })
            if(!userExists){
                throw new Error('the user does not exist')
            }
            if(!postExists){
                throw new Error('the post does not exist')
            }
            const comment={
                id:uuidv4(),
                text:args.text,
                post:args.post,
                author:args.author
            }
            comments.push(comment)

            return comment

        }
    },
    Post:{
        author(parent,args,ctx,info){
            return users.find((user)=>{
                return user.id==parent.author
            })
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment)=>{
                return parent.id===comment.post
            })
        }
    },
    Comment:{
        author(parent,args,ctx,info){
            return users.find((user)=>{
                return user.id==parent.author
            })
        },
        post(parent,args,ctx,info){
            return posts.find((post)=>{
                return post.id==parent.post
            })
        }

    },
    User:{
        posts(parent,args,ctx,info){
            return posts.filter((post)=>{
                return parent.id===post.author
            })
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment)=>{
                return parent.id===comment.author
            })
        }
    }
}

const server=new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=>{
    console.log("the server is up now")
})