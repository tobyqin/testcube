from django import template

register = template.Library()
cache = {}


@register.inclusion_tag('more_menu_links.html')
def more_menu_links():
    from ...utils import get_menu_links
    if 'links' not in cache:
        cache['links'] = get_menu_links()

    return {'links': cache['links']}
