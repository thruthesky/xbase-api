import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

const XBASE_SESSION_ID = 'xbase-session-id';
@Injectable()
export class Xbase {

    serverUrl: string = 'http://w8.philgo.com/etc/xbase/index.php';
    //serverUrl: string = 'http://www.work.org/xbase/index.php';
    constructor(
        private http: Http
    ) {
        console.log("Xbase::constrcutor");
    }



    get requestOptions() : RequestOptions {
        let headers  = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options  = new RequestOptions({ headers: headers });   
        return options;
    }



    /**
     * Returns the body of POST method.
     * 
     * 
     * @param params must be an object.
     */
    buildQuery( params ) {
        return this.http_build_query( params );
        /*
        let keys = Object.keys( params );
        let en = encodeURIComponent;
        let q = keys.map( e => en( e ) + '=' + en( params[e] ) ).join('&');
        console.log('buildQuery(): ', q);
        return q;
        */
    }

    query( data, successCallback, errorCallback ) {
        let body = this.buildQuery( data );
        console.log("debug url: ", this.serverUrl  + '?' + body );
        this.http.post( this.serverUrl, body, this.requestOptions )
            .subscribe( data => {
                try {
                    let re = JSON.parse( data['_body'] );
                    if ( re['code'] ) return errorCallback( re['message'] );
                    //console.log('query::sucess: ', data);
                    successCallback( re['data'] );
                }
                catch( e ) {
                    //console.log(data);
                    errorCallback(data['_body']);
                }
            });
    }


    post_write( data, successCallback: (re:any) => void, errorCallback: (error:string) => void ) {
        data['mc'] = 'post.write';
        this.query( data, successCallback, errorCallback );
    }

    post_edit( data, successCallback: (re:any) => void, errorCallback: (error:string) => void ) {
        data['mc'] = 'post.edit';
        this.query( data, successCallback, errorCallback );
    }

    post_delete( data, successCallback: () => void, errorCallback: (error:string) => void ) {
        data['mc'] = 'post.delete';
        this.query( data, successCallback, errorCallback );
    }

    post_permission( data, successCallback: () => void, errorCallback: (error:string) => void ) {
        data['mc'] = 'post.permission';
        this.query( data, successCallback, errorCallback );
    }

    post_search( options, successCallback: (re:any) => void, errorCallback: (error:string) => void ) {
        let data = {};
        data['mc'] = 'post.search';
        data['options'] = options;
        this.query( data, successCallback, errorCallback );
    }

    user_search( options, successCallback: (re:any) => void, errorCallback: (error:string) => void ) {
        let data = {};
        data['mc'] = 'user.search';
        data['options'] = options;
        this.query( data, successCallback, errorCallback );
    }

    post_get( idx, successCallback: (re:any) => void, errorCallback: (error:string) => void ) {
        let data = { mc: 'post.get', idx: idx};
        this.query( data, successCallback, errorCallback );
    }
    user_get( id, successCallback: (re:any) => void, errorCallback: (error:string) => void ) {
        let data = { mc: 'user.get', id: id};
        this.query( data, successCallback, errorCallback );
    }


    /**
     * @attention it saves user's session id in storage.
     *      the key is 'xbase-session-id'.
     * 
     */
    user_register( data, successCallback: (session_id:string) => void, errorCallback: (error:string) => void ) {
        data['mc'] = 'user.register';
        this.query( data, session_id => {
            localStorage.setItem( XBASE_SESSION_ID, session_id );
            successCallback( session_id );
        }, errorCallback );
    }
    /**
     * Login and save login session id
     */
    user_login( data, successCallback: (session_id:string) => void, errorCallback: (error:string) => void ) {
        data['mc'] = 'user.login';
        this.query( data, session_id => {
            localStorage.setItem( XBASE_SESSION_ID, session_id );
            successCallback( session_id );
        }, errorCallback );
    }


    /**
     * Check if the user logged in xbase
     */
    logged( yesCallback: ( session_id: string ) => void, noCallback?: () => void ) {
        let session_id = localStorage.getItem( XBASE_SESSION_ID );
        if ( session_id ) yesCallback( session_id );
        else noCallback();
    }



    http_build_query (formdata, numericPrefix='', argSeparator='') { 
        var urlencode = this.urlencode;
        var value
        var key
        var tmp = []
        var _httpBuildQueryHelper = function (key, val, argSeparator) {
            var k
            var tmp = []
            if (val === true) {
            val = '1'
            } else if (val === false) {
            val = '0'
            }
            if (val !== null) {
            if (typeof val === 'object') {
                for (k in val) {
                if (val[k] !== null) {
                    tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], argSeparator))
                }
                }
                return tmp.join(argSeparator)
            } else if (typeof val !== 'function') {
                return urlencode(key) + '=' + urlencode(val)
            } else {
                throw new Error('There was an error processing for http_build_query().')
            }
            } else {
            return ''
            }
        }

        if (!argSeparator) {
            argSeparator = '&'
        }
        for (key in formdata) {
            value = formdata[key]
            if (numericPrefix && !isNaN(key)) {
            key = String(numericPrefix) + key
            }
            var query = _httpBuildQueryHelper(key, value, argSeparator)
            if (query !== '') {
            tmp.push(query)
            }
        }

        return tmp.join(argSeparator)
    }


    urlencode (str) {
        str = (str + '')
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/%20/g, '+')
    }
}