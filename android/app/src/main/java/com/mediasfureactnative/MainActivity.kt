package com.mediasfureactnative

import com.facebook.react.ReactApplication
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  private var pendingWindowFocusDispatch = false

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "MediaSFUReactNative"

  override fun onWindowFocusChanged(hasFocus: Boolean) {
    if (!hasFocus) {
      pendingWindowFocusDispatch = false
      super.onWindowFocusChanged(false)
      return
    }

    if (isReactContextReady()) {
      pendingWindowFocusDispatch = false
      super.onWindowFocusChanged(true)
      return
    }

    if (!pendingWindowFocusDispatch) {
      pendingWindowFocusDispatch = true
      window.decorView.post(::dispatchDeferredWindowFocusChange)
    }
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  private fun dispatchDeferredWindowFocusChange() {
    if (isFinishing || isDestroyed) {
      pendingWindowFocusDispatch = false
      return
    }

    if (isReactContextReady()) {
      pendingWindowFocusDispatch = false
      super.onWindowFocusChanged(true)
      return
    }

    window.decorView.post(::dispatchDeferredWindowFocusChange)
  }

  private fun isReactContextReady(): Boolean {
    val reactApplication = application as? ReactApplication ?: return true
    val reactHost = reactApplication.reactHost ?: return true
    return reactHost.currentReactContext != null
  }
}
