import { effect, stop } from '../effect';
import { reactive } from '../reactive';

describe('effect', () => {

  it('happy path', () => {
    const user = reactive({
      age: 10
    })
    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(11)


    // update
    user.age++
    expect(nextAge).toBe(12)
  })

  it('should observe multiple properties', () => {
    let dummy;
    const counter = reactive({ num1: 0, num2: 0 });
    effect(() => (dummy = counter.num1 + counter.num1 + counter.num2));

    expect(dummy).toBe(0);
    counter.num1 = counter.num2 = 7;
    expect(dummy).toBe(21);
  })

  it("should handle multiple effects", () => {
    let dummy1, dummy2;
    const counter = reactive({ num: 0 });
    effect(() => (dummy1 = counter.num));
    effect(() => (dummy2 = counter.num));

    expect(dummy1).toBe(0);
    expect(dummy2).toBe(0);
    counter.num++;
    expect(dummy1).toBe(1);
    expect(dummy2).toBe(1);
  });

  it('should observe nested properties', () => {
    let dummy;
    const counter = reactive({
      nested: {
        num: 0
      }
    })

    effect(() => {
      dummy = counter.nested.num
    })
    expect(dummy).toBe(0)
    counter.nested.num = 10
    expect(dummy).toBe(10)
  })

  it('should observe delete operations', () => {
    let dummy
    const obj = reactive({ prop: 'value' })
    effect(() => (dummy = obj.prop))

    expect(dummy).toBe('value')

    delete obj.prop
    expect(dummy).toBe(undefined)
  })

  it('should observer has operation', () => {
    let dummy
    const obj = reactive({ prop: 'value' })
    effect(() => (dummy = 'prop' in obj))

    expect(dummy).toBe(true)
    delete obj.prop
    expect(dummy).toBe(false)
    obj.prop = 12
    expect(dummy).toBe(true)
  })

  it('should observe properties on the prototype chain', () => {
    let dummy
    const counter = reactive({ num: 0 })
    const parentCounter = reactive({ num: 2 })
    Object.setPrototypeOf(counter, parentCounter)
    effect(() => (dummy = counter.num))

    expect(dummy).toBe(0)
    delete counter.num
    expect(dummy).toBe(2)
    parentCounter.num = 4
    expect(dummy).toBe(4)
    counter.num = 3
    expect(dummy).toBe(3)
  })


  it('should oberve has operations on the prototype chain', () => {
    let dummy
    const counter = reactive({ num: 0 })
    const parentCounter = reactive({ num: 2 })
    Object.setPrototypeOf(counter, parentCounter)
    effect(() => (dummy = 'num' in counter))

    expect(dummy).toBe(true)

    delete counter.num
    expect(dummy).toBe(true)

    delete parentCounter.num
    expect(dummy).toBe(false)
    counter.num = 3
    expect(dummy).toBe(true)
  })

  it('should observe enumeration', () => {
    let dummy = 0
    const numbers = reactive({ num1: 3 })
    effect(() => {
      dummy = 0
      for (const key in numbers) {
        dummy += numbers[key]
      }
    })

    expect(dummy).toBe(3)
    numbers.num2 = 4
    expect(dummy).toBe(7)
    delete numbers.num1
    expect(dummy).toBe(4)
  })


  it("should observe function call chains", () => {
    let dummy;
    const counter = reactive({ num: 0 });
    effect(() => (dummy = getNum()));

    function getNum() {
      return counter.num;
    }

    expect(dummy).toBe(0);
    counter.num = 2;
    expect(dummy).toBe(2);
  });

  it('should return runner when call effect', () => {
    // effect(fn) -> function(runner) -> fn -> return
    let foo = 10;
    const runner = effect(() => {
      foo++
      return 'foo'
    })

    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe("foo")
  })

  it('scheduler', () => {
    // 1. 通过effect的第二个参数给定的一个scheduler的fn
    // 2. effect第一次执行的时候 还会执行fn 
    // 3. 当 响应式对象 set update不会执行fn 而是执行 scheduler
    // 4. 如果说当执行runner 的时候  会再次执行fn
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )

    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run 
    run()
    // should have run 
    expect(dummy).toBe(2)
  })

  it('stop', () => {
    let dummy;
    const obj = reactive({
      prop: 1
    })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    // obj.prop = 3
    // obj.prop = obj.prop + 1
    obj.prop++
    expect(dummy).toBe(2)

    // stopped effect should still be manually callable
    runner()
    expect(dummy).toBe(3)
  })

  it('onstop', () => {
    const obj = reactive({
      foo: 1
    })
    const onStop = jest.fn()
    let dummy
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      {
        onStop,
      }
    )

    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })


  it('should not be triggered when set with the same value', () => {
    const obj = reactive({ foo: 1 })
    let dummy = 0
    effect(() => {
      dummy++
      console.log(obj.foo);
    })
    obj.foo = 1
    expect(dummy).toBe(1)

    obj.foo = 2
    expect(dummy).toBe(2)
  })

  it('should not be triggered when the value and the old value both are NaN', () => {
    const obj = reactive({
      foo: NaN
    })
    const fnSpy = jest.fn(() => obj.foo)
    effect(fnSpy)
    obj.foo = NaN
    expect(fnSpy).toHaveBeenCalledTimes(1)
  })

  it('should observe propertis on the prototype chain', () => {
    let dummy
    const counter = reactive({ num: 0 })
    const parentCounter = reactive({ num: 2 })
    Object.setPrototypeOf(counter, parentCounter)
    effect(() => (dummy = counter.num))

    expect(dummy).toBe(0)
    delete counter.num
    expect(dummy).toBe(2)
    parentCounter.num = 4
    expect(dummy).toBe(4)
    counter.num = 3
    expect(dummy).toBe(3)
  })
})