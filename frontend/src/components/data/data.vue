<template>
    <div>
        <BackgroundCard>
            <template>
                <p class="headline">Count of pet lost after 2019:</p>
                <v-alert
                    v-show="showCountPetError"
                    dense
                    border="left"
                    type="warning"
                    style="margin-top:10px; width:100%;"
                >
                    Server error, please try later
                </v-alert>
                <v-data-table
                    :headers="headerspetCountAfter2019"
                    :items="petCountAfter2019"
                >
                </v-data-table>
            </template>
        </BackgroundCard>
        <BackgroundCard>
            <template>
                <p class="headline">cats' common health issue:</p>
                <v-alert
                    v-show="showCatCommonHealthIssueError"
                    dense
                    border="left"
                    type="warning"
                    style="margin-top:10px; width:100%;"
                >
                    Server error, please try later
                </v-alert>
                <v-data-table
                    :headers="headersCatCommonHealthIssue"
                    :items="CatCommonHealthIssue"
                >
                </v-data-table>
            </template>
        </BackgroundCard>
    </div>
</template>
<script>
    import BackgroundCard from '../card/BackgroundCard.vue'
    import { apishowCountOfLostAfter2019,apishowCatCommonHealthIssue } from "../../requests/api"

    export default {
        name: 'data',
        components: {
            BackgroundCard
        },
        mounted() {
            apishowCountOfLostAfter2019()
            .then(res => {
                this.petCountAfter2019 = res.data;
                    apishowCatCommonHealthIssue()
                    .then(res => {
                        this.CatCommonHealthIssue = res.data;
                    })
                    .catch(err => {
                    console.log("err:"+err.response.data.error);
                    this.showCatCommonHealthIssueError = true;
                    });  
            })
            .catch(err => {
            console.log("err:"+err.response.data.error);
            this.showCountPetError = true;
            });  
        },
        data: () => ({
            headerspetCountAfter2019: [
                { text: 'state', value: 'state' },
                { text: 'category', value: 'category' },
                { text: 'count', value: 'LostPetCount' }
            ],
            petCountAfter2019:[],
            showCountPetError:false,
            headersCatCommonHealthIssue: [
                { text: 'category', value: 'category' },
                { text: 'breed name', value: 'breed_name' },
                { text: 'medical conditions', value: 'medical_conditions' },
                { text: 'count', value: 'CountofIllness' }
            ],
            CatCommonHealthIssue: [],
            showCatCommonHealthIssueError:false
        })
    }
</script>