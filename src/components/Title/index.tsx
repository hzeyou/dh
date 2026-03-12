import React from 'react';

import { getCurrentUser } from 'utils/utils';

const {
  userThemeConfig: { themeColor = '#1b3fee' },
} = getCurrentUser();

import styles from './index.less';

export enum TitleLevel {
  LEVEL_1 = '1',
  LEVEL_2 = '2',
}

interface TitleProps {
  title: React.ReactNode;
  level?: TitleLevel;
  top?: number,
  bottom?: number,
  icon?: React.ReactNode,
  iconColor?: string,
  right?: React.ReactNode,
}

const fontSizeMap = {
  [TitleLevel.LEVEL_1]: 16,
  [TitleLevel.LEVEL_2]: 14,
}

const Title: React.FC<TitleProps> = (props) => {

  const { title, level = '1', top = 0, bottom = 8, icon = '', right, iconColor } = props;

  const iconHeight = fontSizeMap[level] + 2;

  return (
    <div className={styles['pts-customer-title-wrapper']}>
      <div className={styles['pts-customer-title']} style={{ marginTop: top, marginBottom: bottom }}>
        {!!icon ? icon : (
          <span
            className={styles['pts-customer-title-icon']}
            style={{ backgroundColor: iconColor || themeColor || '#1b3fee', height: iconHeight }}
          />
        )}

        <span
          className={[
            styles['pts-customer-title-text'],
            styles[`pts-customer-title-level-${level}`]].join(' ')
          }
        >{title}</span>
      </div>
      <div className={styles['pts-customer-title-right']}>{right}</div>
    </div>
  );
}

export default Title;
