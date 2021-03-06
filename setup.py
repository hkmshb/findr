import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(here, 'README.md')) as f:
    README = f.read()
with open(os.path.join(here, 'CHANGES.md')) as f:
    CHANGES = f.read()
with open(os.path.join(here, 'VERSION')) as f:
    VERSION = f.read().strip()

requires = [
    'pyramid',
    'waitress',
    'sqlalchemy',
    'alembic',
    'pyramid_jinja2',
    'requests'
]

tests_require = [
    'WebTest >= 1.3.1',
    'pytest',
    'pytest-cov',
]


setup(
    name='findr',
    version=VERSION,
    description='findr',
    long_description=README + '\n\n' + CHANGES,
    classifiers=[
        "Programming Language :: Python",
        "Framework :: Pyramid",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
    ],
    author='Abdul-Hakeem Shaibu',
    author_email='hkmshb@gmail.com',
    url='',
    keywords='web pyramid pylons',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=requires,
    extras_require={
        'testing': tests_require
    },
    entry_points="""\
    [paste.app_factory]
    main = findr:main
    """,
)
