##
#
# ————————————————————————————————————————————————————
# Sublime Text Command line
# ————————————————————————————————————————————————————
# Command: window.run_command('subl', { 'args': ['--project', '/path/to/some.sublime-project'] });
# Usage: subl [arguments] [files]         edit the given files
#    or: subl [arguments] [directories]   open the given directories
#    or: subl [arguments] -               edit stdin
#
# Arguments:
#   --project <project>: Load the given project
#   --command <command>: Run the given command
#   -n or --new-window:  Open a new window
#   -a or --add:         Add folders to the current window
#   -w or --wait:        Wait for the files to be closed before returning
#   -b or --background:  Don't activate the application
#   -s or --stay:        Keep the application activated after closing the file
#   -h or --help:        Show help (this message) and exit
#   -v or --version:     Show version and exit
#
# --wait is implied if reading from stdin. Use --stay to not switch back
# to the terminal when a file is closed (only relevant if waiting for a file).
#
##

import sublime
import sublime_plugin
import os
import subprocess


# 定义【Subl】命令
class SublCommand(sublime_plugin.WindowCommand):

    # 执行【Subl】命令
    def run(self, args = []):

        # 替换参数中的环境变量
        env = self.window.extract_variables()
        args = [sublime.expand_variables(x, env) for x in args]

        # 获取【sublime】执行路径
        executable_path = sublime.executable_path()

        # 获取【OSX】下的【subl】目录
        if sublime.platform() == 'osx':
            app_path = executable_path[:executable_path.rfind(".app/") + 5]
            executable_path = app_path + "Contents/SharedSupport/bin/subl"

        # 运行【subl】命令
        print(env, args);
        subprocess.Popen([executable_path] + args)

        # 修复在【Windows】下窗口推动焦点
        if sublime.platform() == "windows":
            def fix_focus():
                window = sublime.active_window()
                view = window.active_view()
                window.run_command('focus_neighboring_group')
                window.focus_view(view)

            sublime.set_timeout(fix_focus, 300)
