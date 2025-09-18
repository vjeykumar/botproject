#!/usr/bin/env python3
"""
Test runner script for Edgecraft Glass API
"""

import os
import sys
import subprocess
import argparse

def run_tests(test_type='all', verbose=False, coverage=False):
    """Run tests with specified options"""
    
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    backend_root = os.path.dirname(backend_dir)
    os.chdir(backend_root)
    
    # Base pytest command
    cmd = ['python', '-m', 'pytest']
    
    # Add test directory
    if test_type == 'all':
        cmd.append('tests/')
    elif test_type == 'unit':
        cmd.extend([
            'tests/test_auth.py',
            'tests/test_products.py',
            'tests/test_orders.py',
            'tests/test_cart.py',
            'tests/test_reviews.py',
            'tests/test_payment.py',
            'tests/test_health.py',
            'tests/test_database.py'
        ])
    elif test_type == 'integration':
        cmd.append('tests/test_integration.py')
    elif test_type == 'error':
        cmd.append('tests/test_error_handlers.py')
    else:
        cmd.append(f'tests/test_{test_type}.py')
    
    # Add verbose flag
    if verbose:
        cmd.append('-v')
    
    # Add coverage
    if coverage:
        cmd.extend(['--cov=.', '--cov-report=html', '--cov-report=term'])
    
    # Add other useful flags
    cmd.extend([
        '--tb=short',  # Shorter traceback format
        '--strict-markers',  # Strict marker checking
        '--disable-warnings'  # Disable warnings for cleaner output
    ])
    
    print(f"Running command: {' '.join(cmd)}")
    print("=" * 50)
    
    try:
        result = subprocess.run(cmd, check=False)
        return result.returncode
    except KeyboardInterrupt:
        print("\nTests interrupted by user")
        return 1
    except Exception as e:
        print(f"Error running tests: {e}")
        return 1

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Run Edgecraft Glass API tests')
    
    parser.add_argument(
        'test_type',
        nargs='?',
        default='all',
        choices=['all', 'unit', 'integration', 'error', 'auth', 'products', 'orders', 'cart', 'reviews', 'payment', 'health', 'database'],
        help='Type of tests to run'
    )
    
    parser.add_argument(
        '-v', '--verbose',
        action='store_true',
        help='Verbose output'
    )
    
    parser.add_argument(
        '-c', '--coverage',
        action='store_true',
        help='Run with coverage report'
    )
    
    args = parser.parse_args()
    
    print("🧪 Edgecraft Glass API Test Runner")
    print("=" * 50)
    print(f"Test Type: {args.test_type}")
    print(f"Verbose: {args.verbose}")
    print(f"Coverage: {args.coverage}")
    print("=" * 50)
    
    exit_code = run_tests(args.test_type, args.verbose, args.coverage)
    
    if exit_code == 0:
        print("\n✅ All tests passed!")
    else:
        print(f"\n❌ Tests failed with exit code: {exit_code}")
    
    sys.exit(exit_code)

if __name__ == '__main__':
    main()