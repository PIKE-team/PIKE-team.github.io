    const app = Vue.createApp({
        template:
        /* html */
        `
        <h1 v-if="this.state != 'Welcome'">{{competition.name}}</h1>
        <p>{{state}}</p>
    
        <!--Welcome-->

        <div v-show="this.state == 'Welcome'" class="container">

            <h1>Welcome</h1>

            <form @submit.prevent="createCompt">
                <input placeholder="competition name" v-model="textForm">
                <input type="submit" value="Create competition">
            </form>
            <p class="row">{{warning}}</p>
        </div>
        
        <!--List-->

        <div v-show="this.state == 'Initial List'" class="container">
            <div class="row">
                <button class="col" @click="backToWelcome">Back</button>
                <h2 class="col">List</h2>
                <button v-show="!this.editInitialList" class="col" @click="turnOnEditInitialList">Edit</button>
                <button class="col" @click="loadPools">Done</button>
            </div>
            <form v-if="this.editInitialList" @submit.prevent="addCompetitor" class="row">
                <input class="col" placeholder="competitor name" v-model="textForm">
                <input class="col" type="number" placeholder="Classification" v-model="numberForm">
                <input class="col" type="submit" value="Add competitor">
            </form>
            <p class="row">{{warning}}</p>
            <div>
                <div class="row" v-for="competitor in this.competition.list">
                    <p class="col">{{competitor.name}}</p>
                    <p class="col">{{competitor.puntuation}}</p>
                    <button class="col" @click="deleteCompetitor(competitor.name)">X</button>
                </div>
            </div>
        </div>

        <!--Pools-->

        <div v-show="this.state == 'Pools'">
            <div class="row">
                <button class="col" @click.prevent="this.state='Initial List'">List</button>
                <h1 class="col">Pools</h1>
                <button v-if="!this.editPools" class="col" @click.prevent="this.turnOnEditPools">Edit</button>
                <button class="col" @click="loadPoolsClassification">Done</button>
            </div>
            <form v-if="this.editPools" class="row" @change.prevent="generatePools" @submit.prevent="">
                <label class="col">Number of pools</label>
                <input class="col" type="number" v-model="poolNumber">
                <button class="col" @click.prevent="turnOffEditPools">OK</button>
            </form>
            <div v-for="pool in this.competition.pools">
                <h2>Pool {{pool.id}}</h2>
                <table class="table">
                    <tr>
                        <th>Name</th>
                        <th v-for="(p, i) in pool.participants">{{i}}</th>
                        <th>tr</th>
                        <th>td</th>
                        <th>tt</th>
                    </tr>
                    <tr v-for="(p, i) in pool.participants">
                        <th>{{p.name}}</th>
                        <th v-for="(p2, j) in pool.participants">
                            <div v-if="p == p2" class="filler"></div>
                            <button v-else-if="this.editPools == false" @click="resolverPoolAssault(pool.id, p.name, p2.name)" >{{assaultTouchesData(pool.id, p.name, p2.name, i, j)}}</button>
                            <div v-else>{{assaultTouchesData(pool.id, p.name, p2.name, i, j)}}</div>
                        </th>
                        <th>{{p.td}}</th>
                        <th>{{p.tr}}</th>
                        <th>{{p.tt}}</th>
                    </tr>
                </table>
            </div>
        </div>

        <!--Pool Assault resolver-->

        <div v-show="this.state == 'Pool Assault Resolver'">
            <p>Assault Resolver</p>
            <form @submit.prevent="submitAssault">
                <div class="row">
                    <label class="col" >{{assaultToResolve.participants[0]}}</label>
                    <select class="col" v-model="touches1">
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <select class="col" v-model="touches2">
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <label class="col" >{{assaultToResolve.participants[1]}}</label>
                </div>
                <div class="row">
                    <input class="col" type='submit'>
                </div>
            </form>
        </div>

        <!--Pool Classification-->
        <div v-show="this.state == 'Pool Classification'">
            <div class="row">
                <button class="col" @click.prevent="this.state = 'Pools'">back</button>
                <h1 class="col">Pool Classification</h1>
                <button class="col" @click="loadTable">Next</button>
            </div>

            <select v-model="this.numberForm">
                <option v-if="2 <= Object.keys(this.competition.poolClassification).length" value="2">2</option>
                <option v-if="4 <= Object.keys(this.competition.poolClassification).length" value="4">4</option>
                <option v-if="8 <= Object.keys(this.competition.poolClassification).length" value="8">8</option>
                <option v-if="16 <= Object.keys(this.competition.poolClassification).length" value="16">16</option>
                <option v-if="32 <= Object.keys(this.competition.poolClassification).length" value="32">32</option>
                <option v-if="64 <= Object.keys(this.competition.poolClassification).length" value="64">64</option>
                <option v-if="128 <= Object.keys(this.competition.poolClassification).length" value="128">128</option>
            </select> 

            <table class="table">
                <tr>
                    <th>Name</th>
                    <th>td</th>
                    <th>tr</th>
                    <th>tt</th>
                </tr>
                <tr v-for="(competitor, i) in this.competition.poolClassification" v-bind:class="{'bg-primary':i+1 <= this.numberForm}">
                    <th>{{competitor.name}}</th>
                    <th>{{competitor.td}}</th>
                    <th>{{competitor.tr}}</th>
                    <th>{{competitor.tt}}</th>
                </tr>
            </table>
        </div>
        
        <!--Table-->
        <div v-show="this.state == 'Table'" class="container">
            <div class="row">
                <button class="col" @click.prevent="this.state = 'Pool Classification'">back</button>
                <h1 class="col">Table</h1>
            </div>
            <div class="row align-items-center">
                <div v-for="(table, i) in competition.tables" class="col">
                    <div class="col" v-for="(assault, j) in table">
                        <h3>{{assault.id+1}}</h3>
                        <div class="container">
                            <div class="row">
                                <p class="col">{{assault.p1.name}}</p>
                                <select class="col" v-model="assault.touches1" @change="updateTable">
                                    <option value=0>0</option>
                                    <option value=1>1</option>
                                    <option value=2>2</option>
                                    <option value=3>3</option>
                                    <option value=4>4</option>
                                    <option value=5>5</option>
                                    <option value=6>6</option>
                                    <option value=7>7</option>
                                    <option value=8>8</option>
                                    <option value=9>9</option>
                                    <option value=10>10</option>
                                    <option value=11>11</option>
                                    <option value=12>12</option>
                                    <option value=13>13</option>
                                    <option value=14>14</option>
                                    <option value=15>15</option>
                                </select>
                            </div>
                            <div class="row">
                                <p class="col">{{assault.p2.name}}</p>
                                <select class="col" v-model="assault.touches2" @change="updateTable">
                                    <option value=0>0</option>
                                    <option value=1>1</option>
                                    <option value=2>2</option>
                                    <option value=3>3</option>
                                    <option value=4>4</option>
                                    <option value=5>5</option>
                                    <option value=6>6</option>
                                    <option value=7>7</option>
                                    <option value=8>8</option>
                                    <option value=9>9</option>
                                    <option value=10>10</option>
                                    <option value=11>11</option>
                                    <option value=12>12</option>
                                    <option value=13>13</option>
                                    <option value=14>14</option>
                                    <option value=15>15</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <p>{{this.competition.winner}}</p>
                </div>
            </div>
        </div>
        `,
    data(){
        return{
            tableAssaultToResolve : {p1 : {name : ''}, p2: {name : ''}, touches1 : 0, touches2 : 2},
            state : 'Welcome',
            competition : {id : '', list : [], pools : [],poolClassification : [], tables : [], winner : ''},
            textForm : '',
            numberForm : 0,
            warning : '',
            poolNumber : 0,
            editPools : true,
            editInitialList : true,
            assaultToResolve : {participants : ['', ''], touches : [null, null]},
            assaultToResolveData : {},
            touches1 : 0,
            touches2 : 0,
        }
    },
    methods:{
        test(){
            console.log(this.competition.poolClassification)
            console.log(Object.keys(this.competition.poolClassification).length)
        },
        backToWelcome(){
            if(confirm("If you go back you will loose everithing, do you stil want to continue?")){
                this.competition = {id : '', list : [], pools : [], tables : [], assaults : []}
                this.state = 'Welcome'
                this.editInitialList = true
                this.editPools = true
            }
            this.update()
        },
        turnOnEditInitialList(){
            if(confirm("If ypu edit the list, you will lose everything from the pools")){
                this.editInitialList = true
            }
            this.update()
        },
        turnOnEditPools(){
            if(confirm("If ypu edit the list, you will lose everything from the pools")){
                this.editPools = true
            }
            this.update()
        },
        createCompt(){
            if(this.textForm == ''){
                this.warning = "Competition name can not be empty"
            }
            else{
                this.warning = ""
                this.competition.name = this.textForm
                this.textForm = ''
                this.state = "Initial List"
            }
            this.update()
        },
        addCompetitor(){
            if(this.textForm == ''){
                this.warning = "Competitor name can not be null"
            }else if(this.numberForm == null){
                this.warning = "Puntuation can not be null"
            }else{
                this.warning = ""
                this.competition.list.push({name : this.textForm, puntuation : this.numberForm})
                this.textForm = ''
                this.numberForm = 0
                this.competition.list.sort(function(a, b){return b.puntuation - a.puntuation})
            }
            this.update()
        },
        deleteCompetitor(name){
            this.competition.list = this.competition.list.filter(c => c.name != name)
            this.update()
        },
        loadPools(){
            this.editInitialList = false
            this.state = 'Pools'
            this.update()
        },
        generatePools(){
            console.log("pool generator")
            console.log(JSON.stringify(this.competition))
            this.editInitialList = false
            numb = this.poolNumber
            if(numb < 1 || numb > this.competition.list.lenght){
                return null
            }
            this.competition.pools = []
            for(var i=0; i<numb; i++){
                var pool = {}
                pool.id = i
                pool.participants = []
                this.competition.pools.push(pool)
            }
            this.competition.list.forEach((participant, i) => {
                console.log(JSON.stringify(participant))
                var poolParticipant = {}
                poolParticipant.name = participant.name
                poolParticipant.td = 0
                poolParticipant.tr = 0
                poolParticipant.tt = 0
                this.competition.pools[i%numb].participants.push(poolParticipant)
            });
            this.competition.pools.forEach(p =>{
                p.assaults = []
                p.participants.forEach(p1=>{
                    p.participants.forEach(p2=>{
                        if(p1 != p2){
                            assault = {participants : [p1.name, p2.name], touches : [null, null]}
                            p.assaults.push(assault)
                        }
                    })
                })
            })
            console.log(this.competition.pools)
            this.update()
        },
        findAssaultInPool(poolId, p1, p2){
            pool = this.competition.pools.find(p => p.id == poolId) 
            if(pool != null){
                assault = pool.assaults.find(a =>((a.participants[0] == p1 || a.participants[0] == p2)&&(a.participants[1] == p1 || a.participants[1]== p2)))
                return assault
            }
            return 'pool not founded'
            
        },
        assaultTouchesData(poolId, p1, p2, i, j){
            assault = this.findAssaultInPool(poolId, p1, p2)
            if(assault.touches[0] == null){
                return ('---/---')
            }
            if(i > j){
                return '' +assault.touches[1] +'/'+assault.touches[0]
            }
            return '' +assault.touches[0] +'/'+assault.touches[1]
        },
        resolverPoolAssault(poolId, p1, p2){
            this.assaultToResolve = this.findAssaultInPool(poolId, p1, p2)
            this.assaultToResolveData = {poolID : poolId, p1 : p1, p2 : p2}
            console.log(this.assaultToResolve)
            this.state = 'Pool Assault Resolver'
        },
        update(){
            localStorage.setItem('competition',JSON.stringify(this.competition))
            localStorage.setItem('state',this.state)
            localStorage.setItem('editPool',this.editPools)
            localStorage.setItem('editInitialList',this.editInitialList)
        },
        submitAssault(){
           this.state = "Pools" 
           this.assaultToResolve.touches[0] = this.touches1
           this.assaultToResolve.touches[1] = this.touches2
           pool = this.competition.pools.find(p => p.id == this.assaultToResolveData.poolID)
           participant1 = pool.participants.find(p => p.name == this.assaultToResolveData.p1)
           participant2 = pool.participants.find(p => p.name == this.assaultToResolveData.p2)
           td1 = participant1.td + parseInt(this.touches1)
           participant1.td = td1
           td2 = participant2.td + parseInt(this.touches2)
           participant2.td = td2
           tr1 = participant1.tr + parseInt(this.touches2)
           participant1.tr = tr1
           tr2 = participant2.tr + parseInt(this.touches1)
           participant2.tr = tr2
           tt1 = participant1.tt + parseInt(this.touches1) - parseInt(this.touches2)
           participant1.tt = tt1
           tt2 = participant2.tt + parseInt(this.touches2) - parseInt(this.touches1)
           participant2.tt = tt2
           this.touches1 = 0
           this.touches2 = 0
           this.update()
        },
        turnOffEditPools(){
            this.editPools = false
            this.update()
        },
        turnOnEditPools(){
            if(confirm("If you edit the pools, you will lose all the resolved assaults from them")){
                this.editPools = true
            }
            this.update()
        },
        loadPoolsClassification(){
            this.numberForm = 2
            this.state = 'Pool Classification'
            poolClassification = []
            this.competition.pools.forEach(pool =>{
                pool.participants.forEach(p =>{
                    console.log(JSON.stringify(p))
                    poolClassification.push(p)
                })
            })
            this.competition.poolClassification = poolClassification
            this.competition.poolClassification.sort((a,b)=>{
                return a.tt - b.tt
            })
        },
        loadTable(){
            classified = this.numberForm
            this.state = 'Table'
            tables = []
            assaults = []
            assaultId = 0
            for(var i=0; i<classified/2; i++){
                assaults.push({id:assaultId, 
                    p1:this.competition.poolClassification[i],
                    p2 : this.competition.poolClassification[classified-i-1],
                    touches1 : 0, touches2 : 0})
                assaultId++
            }
            tables.push(assaults)
            for(var i=classified/4; i>=1; i/=2){
                table = []
                for(var j=0; j<i; j++){
                    table.push({id : assaultId, p1 : {name : '  '}, p2 : {name : '  '}, touches1 : null, touches2 : null})
                    assaultId++
                }
                tables.push(table)
            }
            this.competition.tables = tables
        },
        updateTable(){
            console.log("update table")
            this.competition.tables.forEach((table, i) =>{
                table.forEach((assault, j) =>{
                    if(assault.touches1 != assault.touches2){
                        if(assault.touches1 > assault.touches2){
                            console.log("wins " + assault.p1.name)
                            console.log(i)
                            console.log(Object.keys(this.competition.tables).length)
                            if(i < Object.keys(this.competition.tables).length -1){
                                console.log('Ole')
                                if(j%2 == 0){
                                    this.competition.tables[i+1][Math.floor(j/2)].p1 = assault.p1
                                }else{
                                    this.competition.tables[i+1][Math.floor(j/2)].p2 = assault.p1
                                }
                                if(this.competition.tables[i+1][Math.floor(j/2)].touches1 == null){
                                    this.competition.tables[i+1][Math.floor(j/2)].touches1 = 0
                                }
                            }else{
                                this.competition.winner = assault.p1.name
                            }
                        }else{
                            console.log("wins " + assault.p2.name)
                            if(i < Object.keys(this.competition.tables).length -1){
                                if(j%2 == 0){
                                    this.competition.tables[i+1][Math.floor(j/2)].p1 = assault.p2
                                }else{
                                    this.competition.tables[i+1][Math.floor(j/2)].p2 = assault.p2
                                }
                                if(this.competition.tables[i+1][Math.floor(j/2)].touches2 == null){
                                    this.competition.tables[i+1][Math.floor(j/2)].touches2 = 0
                                }
                            }else{
                                this.competition.winner = assault.p2.name
                            }
                        }
                    }
                })
            })
        },
    },
    mounted(){
        compt = localStorage.getItem('competition')
        if(compt != null){
            this.competition = JSON.parse(compt)
        }
        state = localStorage.getItem('state')
        if(state != null){
            this.state = state
        }
        editPools = localStorage.getItem('editPool')
        if(editPools != null){
            this.editPools =  editPools
        }
        editInitialList = localStorage.getItem('editInitialList')
        if(editInitialList != null){
            this.editInitialList =  editInitialList
        }
    },
})
