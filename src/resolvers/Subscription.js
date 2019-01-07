const Subscription={
    count:{
        subscribe(parent,args,{pubsub},info){
            let count=0;

            setInterval(()=>{
                count++;
                pubsub.publish('count',{
                    count
                })
            },1000)

            return pubsub.asyncIterator('count');
        }
    },
    comment:{
        subscribe(parent,{id},{db,pubsub},info){
            const post= db.posts.find( (post) => post.id===id)
            if(!post){
                throw new Error('Post not found')
            }
            var topic=`comment ${id}`;
            return pubsub.asyncIterator(topic)
        }
    },
    post:{
        subscribe(parent,args,{pubsub},info){
            var topic='posts';
            return pubsub.asyncIterator(topic)
        }
    }
}

export {Subscription as default}