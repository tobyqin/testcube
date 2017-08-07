from tagging.registry import register

from .configuration import Configuration
from .issue import Issue
from .object_source import ObjectSource
from .product import Product
from .result_analysis import ResultAnalysis
from .result_error import ResultError
from .result_file import ResultFile
from .team import Team
from .test_case import TestCase
from .test_client import TestClient
from .test_result import TestResult
from .test_run import TestRun

register(TestCase)
