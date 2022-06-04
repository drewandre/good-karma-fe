def returniOSOutputNameForTargetEnv(target, extra)
  case target
    when 'dev'
      return 'GoodKarmaClubDev' + extra
    when 'prod'
      return 'GoodKarmaClubProd' + extra
    else UI.abort_with_message!('Unknown target supplied to returniOSOutputNameForTargetEnv')
  end
end

def returniOSSchemeForTargetEnv(target)
  case target
    when 'dev'
      return 'Development_Release'
    when 'prod'
      return 'Production_Release'
    else UI.abort_with_message!('Unknown target supplied to returniOSSchemeForTargetEnv')
  end
end

def returnTrackForTarget(target)
  case target
    when 'dev'
      return 'internal'
    when 'prod'
      return 'production'
    else UI.abort_with_message!('Unknown target supplied to returnTrackForTarget')
  end
end

def returnAABPathForTarget(target)
  case target
    when 'dev'
      return 'devRelease/app-dev-release.aab'
    when 'prod'
      return 'productionRelease/app-production-release.aab'
    else UI.abort_with_message!('Unknown target supplied to returnAABPathForTarget')
  end
end

def returnAndroidMinifiedFilePathForTarget(target)
  case target
    when 'dev'
      return 'android/app/build/generated/assets/react/dev/release/index.android.bundle'
    when 'prod'
      return 'android/app/build/generated/assets/react/production/release/index.android.bundle'
    else UI.abort_with_message!('Unknown target supplied to returnAndroidMinifiedFilePathForTarget')
  end
end

def returnAndroidSourceMapFilePathForTarget(target)
  case target
    when 'dev'
      return 'android/app/build/generated/sourcemaps/react/dev/release/index.android.bundle.map'
    when 'prod'
      return 'android/app/build/generated/sourcemaps/react/production/release/index.android.bundle.map'
    else UI.abort_with_message!('Unknown target supplied to returnAndroidSourceMapFilePathForTarget')
  end
end

def returnAndroidBuildCommandForTarget(target)
  case target
    when 'dev'
      return 'npm run build-android-dev-release'
    when 'prod'
      return 'npm run build-android-prod-release'
    else UI.abort_with_message!('Unknown target supplied to returnAndroidBuildCommandForTarget')
  end
end

def returnCustomIconBadgePathForTarget(target)
  case target
    when 'dev'
      return 'fastlane/metadata/dev_badge.png'
    else UI.abort_with_message!('Unknown target supplied to returnCustomIconBadgePathForTarget')
  end
end

def returnGooglePlayTestingLinkForTarget(target)
  case target
    when 'dev'
      return 'https://play.google.com/apps/internaltest/4701516662627583405'
    when 'prod'
      return 'https://play.google.com/apps/internaltest/4699475956522935847'
    else UI.abort_with_message!('Unknown target supplied to returnGooglePlayTestingLinkForTarget')
  end
end

def returnTestflightTestingLinkForTarget(target)
  case target
    when 'dev'
      return 'itms-beta://beta.itunes.apple.com/v1/app/1437859856'
    when 'prod'
      return 'itms-beta://beta.itunes.apple.com/v1/app/1438568937'
    else UI.abort_with_message!('Unknown target supplied to returnTestflightTestingLinkForTarget')
  end
end

def returnAndroidFirebaseAppForEnvironment(target)
  case target
    when 'dev'
      return '1:928339883934:android:c18b8ce096004aeb6a088f'
    when 'prod'
      return '1:778042569236:android:1b1822ecf463a088'
    else UI.abort_with_message!('Unknown target supplied to returnAndroidFirebaseAppForEnvironment')
  end
end

def returniOSFirebaseAppForEnvironment(target)
  case target
    when 'dev'
      return '1:928339883934:ios:dde30bbc664cb3766a088f'
    when 'prod'
      return '1:778042569236:ios:970f94ed3e924d136b6d01'
    else UI.abort_with_message!('Unknown target supplied to returniOSFirebaseAppForEnvironment')
  end
end

def returnGoogleServicesPlistPathForEnvironment(target)
  case target
    when 'dev'
      return 'ios/GoogleService-Info-Dev.plist'
    when 'prod'
      return 'ios/GoogleService-Info-Prod.plist'
    else UI.abort_with_message!('Unknown target supplied to returnGoogleServicesPlistPathForEnvironment')
  end
end

def returnGoogleServicesPlistPathForEnvironment(target)
  case target
    when 'dev'
      return 'ios/GoogleService-Info-Dev.plist'
    when 'prod'
      return 'ios/GoogleService-Info-Prod.plist'
    else UI.abort_with_message!('Unknown target supplied to returnGoogleServicesPlistPathForEnvironment')
  end
end

def returnFirebaseAppDistributionKeyForEnvironment(target)
  case target
    when 'dev'
      return 'fastlane/firebase_app_distribution_keys/dev_firebase_key.json'
    when 'prod'
      return 'fastlane/firebase_app_distribution_keys/prod_firebase_key.json'
    else UI.abort_with_message!('Unknown target supplied to returnFirebaseAppDistributionKeyForEnvironment')
  end
end
