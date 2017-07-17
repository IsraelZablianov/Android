import * as React from 'react';
const SideNav = require('react-simple-sidenav').default;
 
/**
 * for more : https://www.npmjs.com/package/react-simple-sidenav
 */

export type SideNavbarNode = JSX.Element | string;

export interface SideNavbarProps {
    style?: any;            //  Style for root element
    navStyle?: any;         //	Style for nav element
    titleStyle?: any;       //	Styles for title
    itemStyle?: any;        //	Styles for item
    itemHoverStyle?: any;   //  Hover style for item
    title?: SideNavbarNode;           //	Will display on top
    items?: SideNavbarNode[];         //	Array of items in navigation list below the title
    showNav?: boolean;      //	Control whether to open or close side navigation
    openFromRight?: boolean;//	This opens navigation from right side of the window, default is false (from left side).
    onShowNav?: () => void;	//  Trigger when navigation opens
    onHideNav?: () => void;	//  Trigger when navigation close
    children?: SideNavbarNode;        //	Content of navigation. If supplying children to SideNav, title and items will be ignore and replaced by children
    className?: string;
}

export interface SideNavbarState {

}

export class SideNavbar extends React.Component<SideNavbarProps, SideNavbarState> {
    render(): JSX.Element {
        return (
            <SideNav {...this.props} />
        );
    }
}