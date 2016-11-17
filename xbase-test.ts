import { Xbase } from './xbase';
export class XbaseTest {
    private count = 0;
    private xbase: Xbase;
    constructor( xbase ) {
        this.xbase = xbase;


    }

    run() {
        this.test_post_write();
        this.test_post_search();
        this.test_user_search();
        this.test_user_get();
        this.test_post_get();
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