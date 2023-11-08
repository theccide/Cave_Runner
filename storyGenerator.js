const runAPI=(self, name, url, params, callback)=>{
    axios.post(url, {
        token: localStorage.getItem("GPT_TOKEN"),
        ...params
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        callback(self, {name, content: response.data});
        //= response.data[0].message.content;
    })
    .catch(function (error) {
        console.error(error);
    });
}    


class StoryGenerator{

    useCached = true;
    callback = null;
    self = null;
    resourcesLoaded = 0;

    finishedLoading(self, resource){
        self.resourcesLoaded++;
        loadingStatus = resource.name+" loaded";
        if(resource.name === "chatGPT") {
            storyContent = resource.content[0].message.content;
            localStorage.setItem("storyContent",storyContent);

            if(!self.useCached){
                runAPI(self, "ElevenLabs",localStorage.getItem("ELEVENLABS_ENDPOINT"),{
                    textToConvert: storyContent
                }, self.finishedLoading);
            } else self.finishedLoading(self, {name:"ElevenLabs"});

            if(!self.useCached){
                runAPI(self, "DallE2",localStorage.getItem("GPT_IMAGE_ENDPOINT"),{
                    description: "Create a fullscreen image with no text for following story: "+storyContent+" in the style of pixel art for a Nintendo game"
                }, self.finishedLoading);
            } else self.finishedLoading(self, {name:"DallE2"});
        }
        if(self.resourcesLoaded === 3)
            self.callback(self.self);
    }

    generateStory(callback, self){
        this.callback = callback;
        this.self = self;

        if(!this.useCached){
            runAPI(this, "chatGPT",localStorage.getItem("GPT_ENDPOINT"),{
                temperature: 0.8,
                seed: Math.floor(Math.random() * Math.pow(2, 32)),
                max_tokens: 150,
                engine: 'davinci',
                messages: [
                    {
                        "role": "system",
                        "content": "You will be provided with a sentence and your task is write a one sentence plot about it. (Add some randomness to it.) Use the seed ("+Math.floor(Math.random() * Math.pow(2, 32))+")"
                    },
                    {
                        "role": "user",
                        "content": "A game about a treasure hunter exploring a cave"
                    }
                ]
            }, this.finishedLoading);
        } else {
            this.finishedLoading(this, {name:"chatGPT",content:[{message:{content:localStorage.getItem("storyContent")}}]})
        }
    }
}