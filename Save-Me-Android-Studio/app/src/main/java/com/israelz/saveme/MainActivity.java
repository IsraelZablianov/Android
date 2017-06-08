package com.israelz.saveme;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
/**
 * The main activity of the app that creates the webView.
 * */
public class MainActivity extends AppCompatActivity {
    private WebView mainWebView;

    /**
     * onCreate will initialize a webView object that will take the place
     * of all views of the application.
    * */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mainWebView = new WebView(this);
        WebSettings settings = mainWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        mainWebView.loadUrl("file:///android_asset/Save-Me/index.html");
        setContentView(mainWebView);
    }

    /**
    * Overriding the default behavior of back button.
     * When pressing back, go the the previos URL.
    * */
    @Override
    public void onBackPressed() {
        if (mainWebView.canGoBack()) {
            mainWebView.goBack();
        } else {
            finish();
        }
    }
}
