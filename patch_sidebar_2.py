import re

with open('components/eadvo_Sidebar.tsx', 'r') as f:
    content = f.read()

old_menu_groups = """const menuGroups: MenuGroup[] = [
    {
        title: 'HOME',
        items: [
            { icon: <HomeIcon className="h-5 w-5" />, name: 'Beranda', view: 'eAdvokasiBeranda' as View },
        ]
    },
    {
        title: 'PORTAL SATKEM',
        items: [
            { icon: <MailIcon className="h-5 w-5" />, name: 'Permohonan Bantuan Hukum', view: 'list' as View },
            { icon: <QuestionMarkCircleIcon className="h-5 w-5" />, name: 'FAQ & Bantuan', view: 'faq' as View },
        ]
    },"""

new_menu_groups = """const menuGroups: MenuGroup[] = [
    {
        title: 'HOME',
        items: [
            { icon: <HomeIcon className="h-5 w-5" />, name: 'Beranda', view: 'eAdvokasiBeranda' as View },
            { icon: <MailIcon className="h-5 w-5" />, name: 'Permohonan Bantuan Hukum', view: 'list' as View },
            { icon: <QuestionMarkCircleIcon className="h-5 w-5" />, name: 'FAQ & Bantuan', view: 'faq' as View },
        ]
    },"""

if old_menu_groups in content:
    content = content.replace(old_menu_groups, new_menu_groups)
    with open('components/eadvo_Sidebar.tsx', 'w') as f:
        f.write(content)
    print("Sidebar updated successfully!")
else:
    print("Could not find the target string")

