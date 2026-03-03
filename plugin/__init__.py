from __future__ import annotations

from .client import LspBitbakePlugin

__all__ = (
    # ST: core
    "plugin_loaded",
    "plugin_unloaded",
    # ST: commands
    # ST: listeners
    # ...
    "LspBitbakePlugin",
)


def plugin_loaded() -> None:
    """Executed when this plugin is loaded."""
    print("hellooooooo")
    LspBitbakePlugin.setup()


def plugin_unloaded() -> None:
    """Executed when this plugin is unloaded."""
    LspBitbakePlugin.cleanup()
