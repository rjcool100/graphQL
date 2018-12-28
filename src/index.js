import {GraphQLServer} from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

let posts=[{
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

let users=[{
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

let comments=[{
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
        createUser(data:createUserInput!):User!,
        deleteUser(id:ID!):User!,
        deletePost(id:ID!):Post!,
        deleteComment(id:ID!):Comment!,
        createPost(data:createPostInput!):Post!,
        createComment(data:createCommentInput!):Comment!
    }

    input createUserInput{
        name:String!,
        age:Int!,
        email:String!
    }
    
    input createPostInput{
        name:String!,
        topic:String!,
        author:ID!
    }
    
    input createCommentInput{
        text:String!,
        author:ID!,
        post:ID!
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
                return user.email===args.data.email
            })
            if(emailTaken){
                throw new Error('the email is already taken')
            }
            const user={
                id:uuidv4(),
                ...args.data
            }
            users.push(user)

            return user

        },
        deleteUser(parent,args,ctx,info){
            const userIndex=users.findIndex((user)=>{
                return user.id===args.id
            })
            if(userIndex==-1){
                throw new Error('the user does not exist')
            }
            var user=users.splice(userIndex,1)

            posts=posts.filter((post)=>{
                var match=post.author===args.id

                if(match){
                    comments=comments.filter((comment)=>{
                        return comment.post!==post.id
                    })
                }
                return !match
            })

            comments=comments.filter((comment)=>{
                return comment.author!==args.id
            })

            return user[0]

        },
        deletePost(parent,args,ctx,info){
            const postIndex=users.findIndex((post)=>{
                return post.id===args.id
            })
            if(postIndex==-1){
                throw new Error('the post does not exist')
            }
            var post=posts.splice(postIndex,1)

           
            comments=comments.filter((comment)=>{
                return comment.post!==args.id
            })
            return post[0]

        },
        deleteComment(parent,args,ctx,info){
            const commentIndex=users.findIndex((comment)=>{
                return comment.id===args.id
            })
            if(commentIndex==-1){
                throw new Error('the comment does not exist')
            }
            var comment=comments.splice(commentIndex,1)
            return comment[0]
        },
        createPost(parent,args,ctx,info){
            const userExists=users.some((user)=>{
                return user.id===args.data.author
            })
            if(!userExists){
                throw new Error('the user does not exist')
            }
            const post={
                id:uuidv4(),
                ...args.data
            }
            posts.push(post)

            return post

        },
        createComment(parent,args,ctx,info){
            const userExists=users.some((user)=>{
                return user.id===args.data.author
            })
            const postExists=posts.some((post)=>{
                return post.id===args.data.post
            })
            if(!userExists){
                throw new Error('the user does not exist')
            }
            if(!postExists){
                throw new Error('the post does not exist')
            }
            const comment={
                id:uuidv4(),
                ...args.data
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