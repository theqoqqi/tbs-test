import styles from './index.module.css';
import React from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import classNames from 'classnames';

let nextSplashId = 0;

export default class SplashLayer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            splashes: [],
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.splashes.length > 0) {
            this.setState(state => ({
                splashes: [],
            }));
        }
    }

    createSplash(position, text, splashType) {
        let splash = {
            id: nextSplashId++,
            position,
            splashType,
            text,
        };

        this.setState(state => ({
            splashes: [...state.splashes, splash],
        }));
    }

    render() {
        let $splashes = this.state.splashes.map(splash => {
            return (
                <CSSTransition
                    key={splash.id}
                    timeout={3000}
                    classNames={{
                        enter: styles.splashEnter,
                        enterActive: styles.splashEnterActive,
                        exit: styles.splashExit,
                        exitActive: styles.splashExitActive,
                    }}
                >
                    <div
                        className={classNames(styles.splash, styles[splash.splashType])}
                        style={{
                            left: splash.position.x + 'px',
                            top: splash.position.y + 'px',
                        }}
                    >
                        {splash.text}
                    </div>
                </CSSTransition>
            );
        });

        return (
            <TransitionGroup className={styles.splashLayer}>
                {$splashes}
            </TransitionGroup>
        );
    }
}