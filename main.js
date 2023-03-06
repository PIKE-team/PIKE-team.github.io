const app = Vue.createApp({
    data() {
        return {
            data : {name : 'comt antigua'},
            message : "the message is from the app",
            state : "NoCompt",
            comptName : '',
            tiradorName : '',
            warning : '',
            test : ''
        }
    },
    methods: {
        update(){
            localStorage.setItem('competition',JSON.stringify(this.data))
            localStorage.setItem('state', this.state)
        },
        newCompetition(e){
            e.preventDefault();
            if(this.comptName == ''){
                this.warning = "Name must not be null"
            }else{
                console.log("new compt: " +this.comptName)
                this.state='Compt'
                this.data = {}
                this.data.name = this.comptName
                this.comtName = ''
                this.update()
            }
        },
        exitCompetition(){
            this.state = 'NoCompt'
            this.update
        },
        openCompt(e){
            e.preventDefault();
            this.state = 'Compt'
        },
        addTirador(e){
            e.preventDefault();
            if(this.data.list == null){
                this.data.list = []
            }
            this.data.list.push({name : this.tiradorName})
            this.tiradorName = ''
            this.update()
        },
        removeTirador(name){
            this.data.list = this.data.list.filter(t => t.name != name)
            this.update()
        },
        generatePoules(){
            if(this.data.poules == null){
                this.data.poules = []
            }
            poule = {id : 1}
            poule.tiradores = this.data.list
            this.data.poules.push(poule)
            this.update()
        },
        logChange(){
            console.log("changed")
        }
    },
    mounted(){
   //     console.log('App mounted')
        compt = localStorage.getItem('competition')
        if(compt != null){
            this.data = JSON.parse(compt)
            this.state = "Compt"
        }
    }

})
