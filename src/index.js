import {GraphQLServer} from 'graphql-yoga'

const typeDefs=`
    type Query{
        me:User!
    }

    type User{
        id: ID!,
        name:String!,
        age:Int!,
        employed:Boolean!,
        gpa:Float
    }
`

const resolvers={
    Query:{
         me(){
            return {
                id:'123',
                name:'rohit',
                age:27,
                employed:false,
                gpa:null
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