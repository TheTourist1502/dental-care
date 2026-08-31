---
name: new-feature
description: Scaffold a new Flutter feature with the full data/domain/presentation layer structure following the project architecture. Invoke with the feature name as the argument, e.g. /new-feature portfolio.
---

The user wants to scaffold a new feature. The feature name is provided as the argument (e.g. `portfolio`). Use snake_case for file names and PascalCase for class names.

Create the following files under `lib/features/<name>/`:

## data/

### `<name>_api.dart`
Concrete Dio-based API data source. Inject `Dio` via constructor. Methods return raw JSON-decoded maps or throw `DioException`. No domain model imports — return primitives or DTOs only.

```dart
/// Handles all remote API calls for the [<Name>] feature.
class <Name>Api {
  const <Name>Api(this._dio);
  final Dio _dio;

  // TODO: add API methods
}
```

### `<name>_repository_impl.dart`
Concrete implementation of `I<Name>Repository`. Imports from `data/` and `domain/`. Maps raw API responses to domain models.

```dart
/// Concrete implementation of [I<Name>Repository].
class <Name>RepositoryImpl implements I<Name>Repository {
  const <Name>RepositoryImpl(this._api);
  final <Name>Api _api;

  // TODO: implement interface methods
}
```

## domain/

### `<name>_repository.dart`
Abstract interface only. No imports from `data/` or `presentation/`. All methods return domain models.

```dart
/// Abstract contract for <Name> data operations.
abstract interface class I<Name>Repository {
  // TODO: declare methods
}
```

### `models/<name>_model.dart`
Immutable domain model. Use plain Dart classes with `const` constructors. No JSON serialisation logic here.

```dart
/// Immutable domain model for <Name>.
class <Name>Model {
  const <Name>Model({
    // TODO: add fields
  });
}
```

## presentation/

### `providers/<name>_provider.dart`
Riverpod `AsyncNotifierProvider` wired to the repository. Import from `domain/` only.

```dart
/// Provides and manages [<Name>Model] state for the UI.
final <name>Provider = AsyncNotifierProvider<_<Name>Notifier, <Name>Model>(_<Name>Notifier.new);

class _<Name>Notifier extends AsyncNotifier<<Name>Model> {
  @override
  Future<<Name>Model> build() async {
    // TODO: load initial state via repository
    throw UnimplementedError();
  }
}
```

### `screens/<name>_screen.dart`
Top-level route target. Owns `Scaffold`. Reads from providers but contains no business logic.

```dart
/// Top-level screen for the <Name> feature.
class <Name>Screen extends ConsumerWidget {
  const <Name>Screen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(<name>Provider);
    return Scaffold(
      body: state.when(
        data: (_) => const SizedBox.shrink(), // TODO: replace with content
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(e.toString())),
      ),
    );
  }
}
```

## After creating the files

1. Register the concrete implementation as a Riverpod provider in `providers/<name>_provider.dart` so the notifier can resolve `I<Name>Repository` via `ref.watch`.
2. Add the new screen to `lib/core/router/app_router.dart` if a route is needed.
3. Update `.claude/docs/folder-structure.md` to reflect the new files.
4. Run `flutter analyze --no-pub` to verify no import violations.

## Rules to enforce
- `data/` must not import from `presentation/`.
- `domain/` must not import from `data/` or `presentation/`.
- `presentation/` imports `domain/` only.
- Use `ref.watch` in `build`, `ref.read` in callbacks.
- All user-facing strings must use ARB localisation keys.
- All icons must use `Iconify(Mdi.*)` with static SVG strings.
