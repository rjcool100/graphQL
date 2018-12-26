import {GraphQLServer} from 'graphql-yoga'

const posts=[{
    id:'1',
    name:'post1',
    topic:'topic1'   
},
{
    id:'2',
    name:'post2',
    topic:'topic2'   
},
{
    id:'3',
    name:'post3',
    topic:'topic3'   
}]

const typeDefs=`
    type Query{
        greeting(name:String!):String!,
        arr:[Int!]!,
        add(numbers:[Float!]):Int!
        me:User!,
        post:Post!,
        posts(query:String!):[Post!]!
    }

    type User{
        id: ID!,
        name:String!,
        age:Int!,
        employed:Boolean!,
        gpa:Float
    }

    type Post{
        id:ID!,
        name:String!,
        category:String!,
        date:String!
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
                category:'tech',
                date:'today'
            }
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