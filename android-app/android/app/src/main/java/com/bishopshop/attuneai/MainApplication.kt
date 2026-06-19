package com.bishopshop.attuneai

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {
            override fun getPackages(): List<ReactPackage> =
                PackageList(this).packages

            override fun getJSMainModuleName(): String = "index"

            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

            override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
        }

    override val reactHost: ReactHost
        get() = getDefaultReactHost(applicationContext, reactNativeHost)

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, false)
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            load()
        }
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = getSystemService(NotificationManager::class.java)

            val channels = listOf(
                NotificationChannel(
                    "daily_reminder",
                    "Daily Training Reminder",
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "Your daily nudge to train at your preferred time"
                },
                NotificationChannel(
                    "streak_alert",
                    "Streak Alerts",
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "Warnings when your training streak is about to expire"
                },
                NotificationChannel(
                    "achievement",
                    "Achievements",
                    NotificationManager.IMPORTANCE_DEFAULT
                ).apply {
                    description = "Notifications when you earn badges or reach milestones"
                },
                NotificationChannel(
                    "new_content",
                    "New Content",
                    NotificationManager.IMPORTANCE_LOW
                ).apply {
                    description = "Alerts for new concepts, personas, and features"
                }
            )

            channels.forEach { manager.createNotificationChannel(it) }
        }
    }
}
