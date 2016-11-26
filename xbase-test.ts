import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Xbase } from './xbase';
@Component({
    template: `
        <h1>Xbase Test</h1>
        <nav>
        <a routerLink="/two" routerLinkActive="active">Page Two</a>
        <a routerLink="/">Home</a><br>
        <a routerLink="/test/xbase">Run All Tests</a><br>
        <a routerLink="/test/xbase/test_user_register">test user_register </a><br>
        <a routerLink="/test/xbase/test_post_get">test post get</a><br>
        </nav>
    `
})
export class XbaseTestPage {
    private count = 0;
    constructor( private route: ActivatedRoute, private xbase: Xbase ) {
        let method = route.snapshot.params['method'];
        if ( method ) {
            this[method]();
        }
        else this.run();
    }

    run() {
        this.test_user_register();
        this.test_user_get();
        this.test_post_get();
        this.test_post_write();
        this.test_post_search();
        this.test_user_search();
    }
    pass( msg ) {
        this.count ++;
        console.log("["+ this.count +"] PASS : " + msg);
    }
    fail( msg ) {
        this.count ++;
        console.log("["+ this.count +"] FAIL -------- : " + msg);
    }
    test_post_write( callback?: (idx:number) => void ) {
        this.xbase.post_write({
            post_id: 'test',
            title: 'This is title : ' + new Date().getTime(),
            extra_1: 'choice 1',
            extra_2: 'choice_2',
            extra_3: 'Do you want to choose me?',
            extra_9: 3
        },
        re => {
            this.pass('post write success: re: ' + re);
            if ( callback ) callback( re );
        },
        e => {
            this.fail('post write failed: ' + e );
        });
    }
    test_post_search() {
        // search 10
        this.xbase.post_search({},
            re => {
                this.pass('post search success: total_count: ' + re['total_count'] + ' searched count: ' + re['count'] );
            },
            e => {
                this.fail('post search failed: ' + e);
            }
        );
        // search 12 on second page.
        this.xbase.post_search({
                page: 3,
                limit: 12
            },
            re => {
                this.pass('post search success: total_count: ' + re['total_count'] + ' searched count: ' + re['count'] );
            },
            e => {
                this.fail('post search failed: ' + e);
            }
        );
        this.xbase.post_search({
            cond: "title LIKE 'This is%'"
        }, re => {
            console.log(re);
        }, e => {
            this.fail( "post search failed: " + e );
        })
    }
    test_user_search() {
        // search 10
        this.xbase.user_search({},
            re => {
                this.pass('user search success: total_count: ' + re['total_count'] + ' searched count: ' + re['count'] );
            },
            e => {
                this.fail('user search failed: ' + e);
            }
        );
    }


    test_user_register() {
        console.log('test_user_register()');
        let id = 'user1126';
        let registerData = {
            id: id,
            password: '12345',
            email: id + '@gmail.com'
        }
        this.xbase.user_register( registerData, re => {
            this.pass( 'test_user_register success: session_id: ' + re.toString());
        }, e => {
            this.fail("test_user_register failed: " + e );
        })
    }

    test_post_get() {
        this.test_post_write( (idx) => {
            this.xbase.post_get( idx, re => {
                this.pass('post.get success: idx: ' + re['idx'] + ', title: ' + re['title']);
            }, e => {
                this.fail('postget failed: ' + e);
            });
        });
    }

    test_user_get() {
        this.xbase.user_get( 'anonymous', re => {
            this.pass('user.get success: idx: ' + re['idx']);
        }, e => {
            this.fail('user get failed: ' + e);
        });
    }

}