import * as React from 'react';
import ImageTemplateList from "../image-template-list/image-template-list";

export interface AppProps {

}

export interface AppState {
    imagePreviewUrl?: string;
}

export default class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);

        this.state = {
            imagePreviewUrl: undefined,
        };
    }

    render(): JSX.Element {
        return (
            <div className="app">
                <ImageTemplateList imageChanged={(file) => {this.onImageSelected(file)}}>
                </ImageTemplateList>
            </div>
        );
    }

    onImageSelected(file: any): void {
        const url = URL.createObjectURL(file);
        this.setState({
            imagePreviewUrl: url
        })
    }
}