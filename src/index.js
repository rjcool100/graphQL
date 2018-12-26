import {GraphQLServer} from 'graphql-yoga'

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
    name:'user1'
},
{
    id:'2',
    name:'user2'     
},
{
    id:'3',
    name:'user3'
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

    type User{
        id: ID!,
        name:String!,
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
                age:27,
                employed:false,
                gpa:null
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