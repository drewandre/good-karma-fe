def returniOSOutputNameForTargetEnv(target, extra)
  case target
    when 'dev2'
      return 'TradeHoundsDev2' + extra
    when 'dev'
      return 'TradeHoundsDev' + extra
    when 'staging'
      return 'TradeHoundsStaging' + extra
    when 'prod'
      return 'TradeHoundsProd' + extra
    else UI.abort_with_message!('Unknown target supplied to returniOSOutputNameForTargetEnv')
  end
end

def returniOSSchemeForTargetEnv(target)
  case target
    when 'dev2'
      return 'Development_2_Release'
    when 'dev'
      return 'Development_Release'
    when 'staging'
      return 'Staging_Release'
    when 'prod'
      return 'Production_Release'
    else UI.abort_with_message!('Unknown target supplied to returniOSSchemeForTargetEnv')
  end
end

def returnTrackForTarget(target)
  case target
    when 'dev', 'dev2'
      return 'internal'
    when 'staging'
      return 'internal'
    when 'prod'
      return 'production'
    else UI.abort_with_message!('Unknown target supplied to returnTrackForTarget')
  end
end

def returnAABPathForTarget(target)
  case target
    when 'dev2'
      return 'dev2Release/app-dev2-release.aab'
    when 'dev'
      return 'devRelease/app-dev-release.aab'
    when 'staging'
      return 'stagingRelease/app-staging-release.aab'
    when 'prod'
      return 'productionRelease/app-production-release.aab'
    else UI.abort_with_message!('Unknown target supplied to returnAABPathForTarget')
  end
end

def returnAndroidMinifiedFilePathForTarget(target)
  case target
    when 'dev2'
      return 'android/app/build/generated/assets/react/dev2/release/index.android.bundle'
    when 'dev'
      return 'android/app/build/generated/assets/react/dev/release/index.android.bundle'
    when 'staging'
      return 'android/app/build/generated/assets/react/staging/release/index.android.bundle'
    when 'prod'
      return 'android/app/build/generated/assets/react/production/release/index.android.bundle'
    else UI.abort_with_message!('Unknown target supplied to returnAndroidMinifiedFilePathForTarget')
  end
end

def returnAndroidSourceMapFilePathForTarget(target)
  case target
    when 'dev2'
      return 'android/app/build/generated/sourcemaps/react/dev2/release/index.android.bundle.map'
    when 'dev'
      return 'android/app/build/generated/sourcemaps/react/dev/release/index.android.bundle.map'
    when 'staging'
      return 'android/app/build/generated/sourcemaps/react/staging/release/index.android.bundle.map'
    when 'prod'
      return 'android/app/build/generated/sourcemaps/react/production/release/index.android.bundle.map'
    else UI.abort_with_message!('Unknown target supplied to returnAndroidSourceMapFilePathForTarget')
  end
end

def returnAndroidBuildCommandForTarget(target)
  case target
    when 'dev2'
      return 'npm run build-android-dev2-release'
    when 'dev'
      return 'npm run build-android-dev-release'
    when 'staging'
      return 'npm run build-android-staging-release'
    when 'prod'
      return 'npm run build-android-prod-release'
    else UI.abort_with_message!('Unknown target supplied to returnAndroidBuildCommandForTarget')
  end
end

def returnCustomIconBadgePathForTarget(target)
  case target
    when 'dev2'
      return 'fastlane/metadata/dev2_badge.png'
    when 'dev'
      return 'fastlane/metadata/dev_badge.png'
    when 'staging'
      return 'fastlane/metadata/staging_badge.png'
    else UI.abort_with_message!('Unknown target supplied to returnCustomIconBadgePathForTarget')
  end
end

def returnGooglePlayTestingLinkForTarget(target)
  case target
    when 'dev2'
      return 'https://play.google.com/apps/internaltest/4699969134916475556'
    when 'dev'
      return 'https://play.google.com/apps/internaltest/4701516662627583405'
    when 'staging'
      return 'https://play.google.com/apps/internaltest/4699364612185656846'
    when 'prod'
      return 'https://play.google.com/apps/internaltest/4699475956522935847'
    else UI.abort_with_message!('Unknown target supplied to returnGooglePlayTestingLinkForTarget')
  end
end

def returnTestflightTestingLinkForTarget(target)
  case target
    when 'dev2'
      return 'itms-beta://beta.itunes.apple.com/v1/app/1459532032'
    when 'dev'
      return 'itms-beta://beta.itunes.apple.com/v1/app/1437859856'
    when 'staging'
      return 'itms-beta://beta.itunes.apple.com/v1/app/1416673197'
    when 'prod'
      return 'itms-beta://beta.itunes.apple.com/v1/app/1438568937'
    else UI.abort_with_message!('Unknown target supplied to returnTestflightTestingLinkForTarget')
  end
end

def returnAndroidFirebaseAppForEnvironment(target)
  case target
    when 'dev2'
      return '1:659136884284:android:27a2785e14d0534f18dd39'
    when 'dev'
      return '1:928339883934:android:c18b8ce096004aeb6a088f'
    when 'staging'
      return '1:1059337077174:android:803f065431e8f47a3c4117'
    when 'prod'
      return '1:778042569236:android:1b1822ecf463a088'
    else UI.abort_with_message!('Unknown target supplied to returnAndroidFirebaseAppForEnvironment')
  end
end

def returniOSFirebaseAppForEnvironment(target)
  case target
    when 'dev2'
      return '1:659136884284:ios:f59efb65070a8c5f18dd39'
    when 'dev'
      return '1:928339883934:ios:dde30bbc664cb3766a088f'
    when 'staging'
      return '1:1059337077174:ios:df9b92f374952ed83c4117'
    when 'prod'
      return '1:778042569236:ios:970f94ed3e924d136b6d01'
    else UI.abort_with_message!('Unknown target supplied to returniOSFirebaseAppForEnvironment')
  end
end

def returnGoogleServicesPlistPathForEnvironment(target)
  case target
    when 'dev2'
      return 'ios/GoogleService-Info-Dev2.plist'
    when 'dev'
      return 'ios/GoogleService-Info-Dev.plist'
    when 'staging'
      return 'ios/GoogleService-Info-Staging.plist'
    when 'prod'
      return 'ios/GoogleService-Info-Prod.plist'
    else UI.abort_with_message!('Unknown target supplied to returnGoogleServicesPlistPathForEnvironment')
  end
end

def returnGoogleServicesPlistPathForEnvironment(target)
  case target
    when 'dev'
      return 'ios/GoogleService-Info-Dev.plist'
    when 'staging'
      return 'ios/GoogleService-Info-Staging.plist'
    when 'prod'
      return 'ios/GoogleService-Info-Prod.plist'
    else UI.abort_with_message!('Unknown target supplied to returnGoogleServicesPlistPathForEnvironment')
  end
end

def returnFirebaseAppDistributionKeyForEnvironment(target)
  case target
    when 'dev2'
      return 'fastlane/firebase_app_distribution_keys/dev2_firebase_key.json'
    when 'dev'
      return 'fastlane/firebase_app_distribution_keys/dev_firebase_key.json'
    when 'staging'
      return 'fastlane/firebase_app_distribution_keys/staging_firebase_key.json'
    when 'prod'
      return 'fastlane/firebase_app_distribution_keys/prod_firebase_key.json'
    else UI.abort_with_message!('Unknown target supplied to returnFirebaseAppDistributionKeyForEnvironment')
  end
end
