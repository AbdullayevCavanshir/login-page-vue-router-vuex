import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'
import { router } from './router';
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        token: '',
        fbAPIKey: "AIzaSyAbkR84tMriVj6u8kj95jc3lNU3af8t7Oc",


    },
    mutations: {
        setToken(state, token){
            state.token = token
        }, 
        clearToken(state){
            state.token = ''
        }

    },
    actions: {
        initAuth({commit , dispatch}){
            let token = localStorage.getItem("token")
            if(token){

                let expirationDate = localStorage.getItem('expirationDate')
                let time = new Date().getTime

                if(time >= +expirationDate){
                    dispatch("logout")
                }else{
                    commit('setToken', token)//
                    let timerSecond = +expirationDate - time
                    //dispatch("setTimeoutTimer", timerSecond)
                    router.push('/')//
                }

            }else{
                router.push('/auth')
                return false
            }
        },
        login({commit, dispatch, state}, authDate){
            let authLink = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
            if(authDate.isUser){
                authLink = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
            }
            

            return axios.post(authLink + "AIzaSyAbkR84tMriVj6u8kj95jc3lNU3af8t7Oc",
            {email: authDate.email, password: authDate.password, returnSecureToken: true})
            .then(response => {
                commit('setToken', response.data.idToken)
                localStorage.setItem('token', response.data.idToken)
                localStorage.setItem("expirationDate", new Date().getTime()+ +response.data.expiresIn*1000)
                // localStorage.setItem("expirationDate", new Date().getTime()+5000)
                dispatch("setTimeoutTimer", +response.data.expiresIn*1000)
                // dispatch("setTimeoutTimer", 5000)
            } )
        },
        logout({commit, dispatch, state}){
            commit("clearToken")
            localStorage.removeItem("token")
            localStorage.removeItem("expirationDate")

            router.replace("/auth")


        },
        setTimeoutTimer({dispatch}, expiresIn){
            setTimeout(()=>{
                dispatch("logout")
            }, expiresIn)
        }
    },
    getters: {
        isAuthenticated(state){
            return state.token !== ""
        }
    }
})

export default store