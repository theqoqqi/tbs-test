
import styles from './styles/Subtitle.module.css';
import React from 'react';

export default function Subtitle(props) {
   return <span {...props} className={styles.subtitle}>{props.children}</span>;
}