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
      return 'productionRelease/app-release.aab'
    else UI.abort_with_message!('Unknown target supplied to returnAABPathForTarget')
  end
end

def returnAndroidMinifiedFilePathForTarget(target)
  case target
    when 'dev'
      return 'android/app/build/generated/assets/react/dev/release/index.android.bundle'
    when 'prod'
      return 'android/app/build/generated/assets/react/release/index.android.bundle'
    else UI.abort_with_message!('Unknown target supplied to returnAndroidMinifiedFilePathForTarget')
  end
end

def returnAndroidSourceMapFilePathForTarget(target)
  case target
    when 'dev'
      return 'android/app/build/generated/sourcemaps/react/dev/release/index.android.bundle.map'
    when 'prod'
      return 'android/app/build/generated/sourcemaps/react/release/index.android.bundle.map'
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
