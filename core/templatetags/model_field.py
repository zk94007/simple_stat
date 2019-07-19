from django import template
register = template.Library()

@register.filter
def field(value, arg):
    return getattr(value, arg)